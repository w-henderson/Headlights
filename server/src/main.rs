pub mod data;
pub mod handlers;
pub mod query;

use crate::data::Data;

use humphrey::App;

pub struct State {
    data: Data,
}

fn main() {
    let state = State {
        data: Data::load(concat!(env!("CARGO_MANIFEST_DIR"), "/datasets")).unwrap(),
    };

    let app: App<State> = App::new_with_config(8, state)
        .with_route("/api/v1/start", handlers::start)
        .with_route("/api/v1/data/series", handlers::series)
        .with_route("/api/v1/data/point", handlers::point)
        .with_route("/api/v1/search", handlers::search);

    app.run("0.0.0.0:80").unwrap();
}
