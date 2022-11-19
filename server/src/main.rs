pub mod data;
pub mod handlers;
pub mod headlines;
pub mod query;

use crate::data::Data;

use humphrey::http::cors::Cors;
use humphrey::App;

use std::sync::Mutex;

pub struct State {
    data: Mutex<Data>,
}

fn main() {
    println!("[info] loading datasets");

    let state = State {
        data: Mutex::new(
            Data::load(
                concat!(env!("CARGO_MANIFEST_DIR"), "/datasets"),
                concat!(env!("CARGO_MANIFEST_DIR"), "/headlines.json"),
            )
            .unwrap(),
        ),
    };

    println!("[info] starting server");

    let app: App<State> = App::new_with_config(8, state)
        .with_cors(Cors::wildcard())
        .with_route("/api/v1/start", handlers::start)
        .with_route("/api/v1/data/series", handlers::series)
        .with_route("/api/v1/data/point", handlers::point)
        .with_route("/api/v1/search", handlers::search);

    app.run("0.0.0.0:80").unwrap();
}
