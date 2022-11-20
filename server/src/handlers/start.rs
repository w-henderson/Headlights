use crate::data::{Data, Dataset};

use rand::prelude::*;

pub fn get_random_dataset(data: &mut Data) -> &Dataset {
    let index = rand::thread_rng().gen_range(0..data.datasets.len());
    let dataset = &mut data.datasets[index];
    dataset.load_into_memory();
    dataset
}

pub fn get_random_year_range(start: u16, end: u16) -> (u16, u16, u16) {
    if end - start < 13 {
        panic!("Dataset is too small to generate a random year range");
    } else if end - start < 18 {
        let start = rand::thread_rng().gen_range(start..end - 13);
        (start, start + 10, start + 13)
    } else {
        let len = rand::thread_rng().gen_range(10..15);
        let start = rand::thread_rng().gen_range(start..end - len - 3);
        (start, start + len, start + len + 3)
    }
}
