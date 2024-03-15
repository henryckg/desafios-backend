import { Faker, en } from '@faker-js/faker';

const faker = new Faker({
    locale: en
});

export const generateProducts = () => {
    const productsMock = []
    for(let i = 0; i<100; i++){
        productsMock.push(generateMock())
    }
    return productsMock
}

const generateMock = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        thumbnail: [faker.image.url()],
        price: faker.commerce.price({dec: 0}),
        code: faker.string.alphanumeric({length: 10}).toUpperCase(),
        avilable: faker.datatype.boolean(0.85),
        stock: faker.number.int({min: 0, max: 20}),
        category: faker.commerce.department()
    }
}