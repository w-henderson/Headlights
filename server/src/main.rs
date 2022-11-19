mod data;

fn main() {
    let data = data::Data::load(concat!(env!("CARGO_MANIFEST_DIR"), "/datasets")).unwrap();

    println!("{:?}", data);
}
