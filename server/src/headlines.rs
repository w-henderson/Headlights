use std::path::Path;

use humphrey_json::Value;

#[derive(Debug, Clone)]
pub struct Headline {
    pub id: String,
    pub title: String,
    pub source: String,
    pub date: i64,
    pub year: u16,
}

impl Headline {
    pub fn load(path: impl AsRef<Path>) -> Option<Vec<Headline>> {
        let mut result = Vec::new();
        let raw_data = std::fs::read_to_string(path).ok()?;
        let json: Value = humphrey_json::from_str(raw_data).ok()?;

        let years = json.as_object()?;

        for (year, headlines) in years {
            let headlines = headlines.as_array()?;
            let year = year.parse::<u16>().ok()?;

            result.extend(headlines.iter().filter_map(|headline| {
                let date = headline["date"].as_str()?;
                let title = headline["headline"].as_str()?;
                let link = headline["link"].as_str()?;

                let date = dateparser::parse(&format!("{} {}", date, year))
                    .ok()?
                    .timestamp();

                Some(Headline {
                    id: link.to_string(),
                    title: title.to_string(),
                    source: "BBC".to_string(),
                    date,
                    year,
                })
            }))
        }

        Some(result)
    }
}
