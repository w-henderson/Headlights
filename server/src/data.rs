use humphrey_json::Value;

use std::path::{Path, PathBuf};

#[derive(Debug)]
pub struct Data {
    datasets: Vec<Dataset>,
}

#[derive(Debug)]
pub struct Dataset {
    id: String,
    name: String,
    y_axis_name: String,
    start: u16,
    end: u16,
    data: DataSource,
}

#[derive(Debug)]
pub enum DataSource {
    Filesystem(PathBuf),
    Memory(Vec<(u16, f64)>),
}

impl Data {
    pub fn load(root: impl AsRef<Path>) -> Option<Data> {
        let root = root.as_ref();
        let mut datasets = Vec::new();

        for entry in root.read_dir().ok()?.flatten() {
            let path = entry.path();

            if path.is_dir() {
                datasets.push(Dataset::load(path)?);
            }
        }

        Some(Data { datasets })
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
}
