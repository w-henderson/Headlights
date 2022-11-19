mod point;
mod series;
mod start;

use crate::State;

use humphrey::http::{Request, Response, StatusCode};
use humphrey_json::prelude::*;

use std::sync::Arc;

pub fn start(_: Request, state: Arc<State>) -> Response {
    let mut data = state.data.lock().unwrap();
    let dataset = start::get_random_dataset(&mut data);
    let (start, end, question) = start::get_random_year_range(dataset.start, dataset.end);

    let json = json!({
        "id": &dataset.id,
        "name": &dataset.name,
        "start": start,
        "end": end,
        "question": question
    });

    Response::new(StatusCode::OK, json.serialize())
}

pub fn series(request: Request, state: Arc<State>) -> Response {
    error_context(|| {
        let (id, start, end) = series::parse_query_string(&request.query)?;

        let mut data = state.data.lock().unwrap();
        let dataset = data.get_dataset(id)?;

        if start < dataset.start || end > dataset.end {
            return Some(Response::new(StatusCode::BadRequest, "Invalid time range"));
        }

        let data = dataset.get_range(start, end);
        let data = series::serialize_data(&data);

        let json = json!({
            "id": &dataset.id,
            "name": &dataset.name,
            "yAxisName": &dataset.y_axis_name,
            "points": data
        });

        Some(Response::new(StatusCode::OK, json.serialize()))
    })
}

pub fn point(request: Request, state: Arc<State>) -> Response {
    error_context(|| {
        let (id, year) = point::parse_query_string(&request.query)?;

        let mut data = state.data.lock().unwrap();
        let dataset = data.get_dataset(id)?;

        let value = dataset.get_point(year)?;

        let json = json!({
            "year": year,
            "value": value
        });

        Some(Response::new(StatusCode::OK, json.serialize()))
    })
}

pub fn search(request: Request, state: Arc<State>) -> Response {
    error_context(|| None)
}

fn error_context(f: impl Fn() -> Option<Response>) -> Response {
    match f() {
        Some(response) => response,
        None => Response::new(StatusCode::BadRequest, "Bad request"),
    }
}
