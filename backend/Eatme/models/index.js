'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.Menu.create({name: 'Margherita', type: 'Pizza', smallPrize: 20, largePrize: 26, integridients: 'sos, mozzarella, oregano'}),
// db.Menu.create({name: 'Livorno', type: 'Pizza', smallPrize: 23, largePrize: 30, integridients: 'sos, mozzarella, biała mozzarella, bazylia'}),
// db.Menu.create({name: 'Perugia', type: 'Pizza', smallPrize: 24, largePrize: 31, integridients: 'sos, mozzarella, szpinak, czosnek, pieczarki, papryka grillowana, kukurydza'}),
// db.Menu.create({name: 'Venezia', type: 'Pizza', smallPrize: 24, largePrize: 31, integridients: 'sos, mozzarella, szynka, pieczarki, oregano'}),
// db.Menu.create({name: 'Napoli', type: 'Pizza', smallPrize: 25, largePrize: 32, integridients: 'sos, mozzarella, kurczak, pieczarki, kukurydza'}),
// db.Menu.create({name: 'Modena', type: 'Pizza', smallPrize: 25, largePrize: 34, integridients: 'sos, mozzarella, kurczak, ananas, kukurydza'}),
// db.Menu.create({name: 'Parma', type: 'Pizza', smallPrize: 26, largePrize: 34, integridients: 'sos, mozzarella, boczek, powidło śliwkowe, peperoni, oregano'}),
// db.Menu.create({name: 'Brescia', type: 'Pizza', smallPrize: 26, largePrize: 34, integridients: 'oliwa, mozzarella, kurczak, szpinak, czosnek, majonez'}),
// db.Menu.create({name: 'Florencja', type: 'Pizza', smallPrize: 26, largePrize: 34, integridients: 'sos, mozzarella, kurczak, szpinak, czosnek, grana padano'}),
// db.Menu.create({name: 'Bari', type: 'Pizza', smallPrize: 26, largePrize: 34, integridients: 'oliwa, mozzarella, gorgonzola, grana padano, scamorza'}),
// db.Menu.create({name: 'Capriciossa', type: 'Pizza', smallPrize: 26, largePrize: 34, integridients: 'sos, mozzarella, szynka, pieczarki, papryka grillowana, czarne oliwki'}),
// db.Menu.create({name: 'Cagliari', type: 'Pizza', smallPrize: 27, largePrize: 35, integridients: 'sos, mozzarella, kurczak, szpinak, czosnek, pomidory koktajlowe, zielone oliwki , kapary'}),
// db.Menu.create({name: 'Palermo', type: 'Pizza', smallPrize: 27, largePrize: 35, integridients: 'oliwa, mozzarella, szynka, suszone pomidory, majonez, rukola'}),
// db.Menu.create({name: 'Torino', type: 'Pizza', smallPrize: 27, largePrize: 35, integridients: 'sos, mozzarella, salami pikantne, czosnek, papryka grillowana, czarne oliwki'}),
// db.Menu.create({name: 'Genova', type: 'Pizza', smallPrize: 27, largePrize: 35, integridients: 'sos, mozzarella, salami łagodne, pieczarki, pomidory koktajlowe'}),
// db.Menu.create({name: 'Bolonia', type: 'Pizza', smallPrize: 27, largePrize: 35, integridients: 'sos, mozzarella, salami pikantne, cebula, peperoni, czosnek, oregano'}),
// db.Menu.create({name: 'Milano', type: 'Pizza', smallPrize: 27, largePrize: 35, integridients: 'oliwa, mozzarella, prosciutto, pomidory koktajlowe, grana padano, rukola'}),
// db.Menu.create({name: 'Verona', type: 'Pizza', smallPrize: 27, largePrize: 35, integridients: 'sos, mozzarella, boczek, szynka, salami pikantne, papryka grillowana, pieczarki, cebula'}),
// db.Menu.create({name: 'Zbyszek klasyczny', type: 'Burger', smallPrize: 18, largePrize: 23, integridients: 'wołowina, sałata, pomidor, czerwona cebula, ogórek, sos podstawowy, sos BBQ'}),
// db.Menu.create({name: 'Wiktor bekonowy', type: 'Burger', smallPrize: 21, largePrize: 26, integridients: 'wołowina, ser, bekon, sałata, pomidor, czerwona cebula, ogórek, sos podstawowy, sos BBQ'}),
// db.Menu.create({name: 'Olek na jajku', type: 'Burger', smallPrize: 21, largePrize: 26, integridients: 'wołowina, jajko sadzone, bekon, sałata, pomidor, czerwona cebula, ogórek, sos podstawowy, sos BBQ'}),
// db.Menu.create({name: 'Leszek gruszkowy', type: 'Burger', smallPrize: 24, largePrize: 29, integridients: 'wołowina, ser pleśniowy, bekon, grillowana gruszka, sałata, cebula, ogórek, sos podstawowy, sos musztardowo-miodowy'}),
// db.Menu.create({name: 'Henryk pikantny', type: 'Burger', smallPrize: 25, largePrize: 30, integridients: 'wołowina, ser pleśniowy, papryczki jalapeno, grillowana gruszka, karmelizowane wiśnie, pomidor, cebula, sałata, sos podstawowy'}),
// db.Menu.create({name: 'Tomek wiśniowy', type: 'Burger', smallPrize: 25, largePrize: 30, integridients: 'wołowina, oscypek, karmelizowane wiśnie, sałata, pomidor, cebula, sos podstawowy'}),
// db.Menu.create({name: 'Bogdan ostry', type: 'Burger', smallPrize: 24, largePrize: 29, integridients: 'wołowina, chorizo, ser mozarella, sałata, pomidor, cebula, ogórek, sos podstawowy, sos ostry'}),
// db.Menu.create({name: 'Dominik kurczakowy', type: 'Burger', smallPrize: 20, largePrize: 25, integridients: 'panierowana pierś z kurczaka, ser, bekon, sałata, pomidor, czerwona cebula, ogórek, sos podstawowy, sos BBQ'}),
// db.Menu.create({name: 'Janek pikantny', type: 'Burger', smallPrize: 20, largePrize: 25, integridients: 'panierowana pierś z kurczaka, ser pleśniowy, papryczki jalapeno, sałata, czerwona cebula, ogórek, sos podstawowy, sos musztardowo-miodowy'}),
// db.Menu.create({name: 'Sebastian grecki', type: 'Burger', smallPrize: 20, largePrize: 25, integridients: 'wołowina, suszone pomidory, ser feta, sałata, cebula, ogórek, sos podstawowy, sos czosnkowo-bazyliowy'}),
// db.Menu.create({name: 'Franek wege', type: 'Burger', smallPrize: 18, largePrize: 23, integridients: 'placek z ciecierzycy, ser feta, grillowana cukinia, sałata, pomidor, cebula, sos podstawowy, sos czosnkowo-bazyliowy'})

module.exports = db;
