use crate::query;

pub fn parse_query_string(q: &str) -> Option<(String, u16)> {
    let query = query::parse_query_string(q)?;
    let id = &query.iter().find(|(key, _)| key == "id")?.1;
    let time = &query.iter().find(|(key, _)| key == "time")?.1;
    let year = time.parse::<u16>().ok()?;

    Some((id.to_string(), year))
}
