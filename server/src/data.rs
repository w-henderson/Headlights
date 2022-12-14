use crate::headlines::Headline;

use humphrey_json::prelude::*;
use humphrey_json::Value;

use std::path::{Path, PathBuf};

#[derive(Debug)]
pub struct Data {
    pub datasets: Vec<Dataset>,
    pub headlines: Vec<Headline>,
}

#[derive(Debug, Clone)]
pub struct Dataset {
    pub id: String,
    pub name: String,
    pub y_axis_name: String,
    pub start: u16,
    pub end: u16,
    pub data: DataSource,
}

#[derive(Debug, Clone)]
pub enum DataSource {
    Filesystem(PathBuf),
    Memory(Vec<(u16, f64)>),
}

pub trait DataThing {
    fn name(&self) -> &str;
    fn valid_for_date_range(&self, start: u16, end: u16) -> bool;
    fn serialize(&self) -> Value;
}

impl Data {
    pub fn load(datasets: impl AsRef<Path>, headlines: impl AsRef<Path>) -> Option<Data> {
        let root = datasets.as_ref();
        let mut datasets = Vec::new();

        for entry in root.read_dir().ok()?.flatten() {
            let path = entry.path();

            if path.is_dir() {
                datasets.push(Dataset::load(path)?);
            }
        }

        let headlines = Headline::load(headlines)?;

        Some(Data {
            datasets,
            headlines,
        })
    }

    pub fn get_dataset(&mut self, id: impl AsRef<str>) -> Option<&Dataset> {
        let dataset = self.datasets.iter_mut().find(|d| d.id == id.as_ref())?;
        dataset.load_into_memory()?;
        Some(dataset)
    }

    pub fn search<'a>(
        &'a self,
        query: impl AsRef<str>,
        start: u16,
        end: u16,
        limit: usize,
    ) -> impl Iterator<Item = Box<dyn DataThing + 'a>> {
        let query = query.as_ref().to_lowercase();

        self.datasets
            .iter()
            .map(|d| Box::new(d) as Box<dyn DataThing>)
            .chain(
                self.headlines
                    .iter()
                    .map(|h| Box::new(h) as Box<dyn DataThing>),
            )
            .filter(move |d| {
                d.name().to_lowercase().contains(&query) && d.valid_for_date_range(start, end)
            })
            .take(limit)
    }
}

impl Dataset {
    pub fn load(root: impl AsRef<Path>) -> Option<Dataset> {
        let id = root.as_ref().file_name()?.to_str()?.to_string();

        let meta = root.as_ref().join("meta.json");
        let data = root.as_ref().join("data.csv");

        let meta = std::fs::read_to_string(meta).ok()?;
        let meta: Value = humphrey_json::from_str(&meta).ok()?;

        let name = meta["name"].as_str()?.to_string();
        let y_axis_name = meta["yAxisName"].as_str()?.to_string();
        let start = meta["start"].as_number()? as u16;
        let end = meta["end"].as_number()? as u16;

        Some(Dataset {
            id,
            name,
            y_axis_name,
            start,
            end,
            data: DataSource::Filesystem(data),
        })
    }

    pub fn load_into_memory(&mut self) -> Option<()> {
        if let DataSource::Filesystem(path) = &self.data {
            let mut data = Vec::new();

            let raw_data = std::fs::read_to_string(path).ok()?;
            let lines = raw_data.lines();

            for record in lines {
                let mut record = record.split(',');

                let year = record.next()?.parse().ok()?;
                let value = record.next()?.parse().ok()?;

                data.push((year, value));
            }

            self.data = DataSource::Memory(data);
        }

        Some(())
    }

    pub fn get_point(&self, year: u16) -> Option<f64> {
        if let DataSource::Memory(data) = &self.data {
            data.iter().find(|(y, _)| *y == year).map(|(_, v)| *v)
        } else {
            None
        }
    }

    pub fn get_range(&self, start: u16, end: u16) -> Vec<(u16, f64)> {
        let mut result = Vec::with_capacity((end - start) as usize);

        if let DataSource::Memory(data) = &self.data {
            for (year, value) in data {
                if *year >= start && *year <= end {
                    result.push((*year, *value));
                }
            }
        } else {
            panic!("Not loaded into memory");
        }

        result
    }
}

impl DataThing for &Dataset {
    fn name(&self) -> &str {
        &self.name
    }

    fn valid_for_date_range(&self, start: u16, end: u16) -> bool {
        self.start <= start && self.end >= end
    }

    fn serialize(&self) -> Value {
        json!({
            "type": "dataset",
            "id": &self.id,
            "name": &self.name
        })
    }
}
