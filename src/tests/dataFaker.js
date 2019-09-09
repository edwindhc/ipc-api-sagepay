const faker = require('faker');
const Product = require('../models/product.model');
const User = require('../models/user.model');
require('../index')

const categories = ["Baby", "Movies", "Shoes", "Books", "Electronics","Computers", "Kids"];

const images = [faker.image.food(), faker.image.nature(), faker.image.people(), faker.image.fashion(), faker.image.nightlife()]

const users = async () => {
    const userTest = {
        name: 'Edwin Hernandez',
        email: 'edwin@gmail.com',
        password: '123456'
    }
    await User.create(userTest);

    for (let i = 0; i < 20; i++) {
        const user = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: '123456'
        }
        const getUser = await User.create(user);
        products(getUser)
    }
}
const products = (user) => {
    for (let i = 0; i < 10; i++) {
        new Product({
            name : faker.commerce.productName(),
            price : faker.commerce.price(),
            category: categories[Math.floor(Math.random() * categories.length)],
            description : faker.lorem.paragraph(),
            picture: images[Math.floor(Math.random() * images.length)],
            stock: Math.floor(Math.random() * 100) + 100,
            userId: user.id
        }).save()
    }
}

const main = async () => {
    await User.remove({});
    await Product.remove({});
    users()
}

main();
console.log('Data faker run')