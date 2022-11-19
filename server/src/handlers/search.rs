use crate::query;

pub fn parse_query_string(q: &str) -> Option<(String, u16, u16)> {
    let query = query::parse_query_string(q)?;
    let q = &query.iter().find(|(key, _)| key == "q")?.1;
    let start = &query.iter().find(|(key, _)| key == "start")?.1;
    let end = &query.iter().find(|(key, _)| key == "end")?.1;

    let start = start.parse::<u16>().ok()?;
    let end = end.parse::<u16>().ok()?;

    Some((q.to_string(), start, end))
}
