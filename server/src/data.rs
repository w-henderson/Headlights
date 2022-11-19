use humphrey_json::Value;

use std::path::{Path, PathBuf};

#[derive(Debug)]
pub struct Data {
    datasets: Vec<Dataset>,
}

#[derive(Debug)]
pub struct Dataset {
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
        let meta = root.as_ref().join("meta.json");
        let data = root.as_ref().join("data.csv");

        let meta = std::fs::read_to_string(meta).ok()?;
        let meta: Value = humphrey_json::from_str(&meta).ok()?;

        let name = meta["name"].as_str()?.to_string();
        let y_axis_name = meta["yAxisName"].as_str()?.to_string();
        let start = meta["start"].as_number()? as u16;
        let end = meta["end"].as_number()? as u16;

        Some(Dataset {
            name,
            y_axis_name,
            start,
            end,
            data: DataSource::Filesystem(data),
        })
    }
}
