use crate::query;

use humphrey_json::prelude::*;
use humphrey_json::Value;

pub fn parse_query_string(q: &str) -> Option<(String, u16, u16)> {
    let query = query::parse_query_string(q)?;
    let id = &query.iter().find(|(key, _)| key == "id")?.1;
    let start = &query.iter().find(|(key, _)| key == "start")?.1;
    let end = &query.iter().find(|(key, _)| key == "end")?.1;

    let start = start.parse::<u16>().ok()?;
    let end = end.parse::<u16>().ok()?;

    Some((id.to_string(), start, end))
}

pub fn serialize_data(data: &[(u16, f64)]) -> Value {
    let mut result = Vec::new();

    for (year, value) in data {
        result.push(json!({
            "year": year,
            "value": value
        }));
    }

    Value::Array(result)
}
