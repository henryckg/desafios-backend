import { Faker, en } from '@faker-js/faker';

const faker = new Faker({
    locale: [en]
});

export const generateProducts = (req, res) => {
    const productsMock = []
    for(let i = 0; i<100; i++){
        productsMock.push(generateMock())
    }
    res.send({status: 'success', payload: productsMock})
}

const generateMock = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        thumbnail: [faker.image.url()],
        price: faker.commerce.price(),
        code: faker.commerce.isbn(10),
        avilable: faker.datatype.boolean(0.85),
        stock: faker.number.int({min: 0, max: 20}),
        category: faker.commerce.department()
    }
}