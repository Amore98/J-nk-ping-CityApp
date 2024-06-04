const stores = require("./stores");
const { User } = require("./Data/Users.js")
const mongoose = require("mongoose")
const { Store } = require("./Data/Stores.js")
const bcrypt = require('bcrypt');
const saltRounds = 10;

class MongoDB {
    async connect() {
        try {
            await mongoose.connect(process.env.MONGODB_URI)
            this.db = mongoose.connection
            console.log("Connected to MongoDB")
        } catch(err) {
            console.log('Failed to connect to MongoDB', err)
        }
    }

    async insert_data() {
        if (await this.db.collection("stores").countDocuments() <= 0) {
            // Inserting JSON data here
            console.log("Inserting JSON Data")
            longitude_mid = 14.169493
            for (const store of stores) {
                if (store.latitude <= store.longitude) {
                    store.district = "Väster"
                } else {
                    store.district = "Öster"
                }
                let storeObj = new Store(store)
                this.db.collection("stores").insertOne(storeObj, (err, res) => {
                    if (err) throw err
                })
            }
        }
    }

    async get_stores() {
        return await Store.find({})
    }

    async get_store_document(id) {
        return await Store.find({"_id" : mongoose.Types.ObjectId(id)})
    }

    async search_store_names(name) {
        const regex = new RegExp(name, 'i');

        try {
            const stores = await Store.find({ name: { $regex: regex } });
            console.log(stores)
            return stores;
        } catch (error) {
            console.error(error);
        }
    }

    async get_east_stores() {
        try {
            const stores = await Store.find({ district: "Öster" });
            console.log(stores)
            return stores;
        } catch (error) {
            console.error(error);
        }
    }

    async get_west_stores() {
        try {
            const stores = await Store.find({ district: "Väster" });
            console.log(stores)
            return stores;
        } catch (error) {
            console.error(error);
        }
    }
    async create_user(email, username, password) {
        let userExists = await User.find({ "$or": [ { email: email }, { username: username} ] })
        if (userExists.length == 0) {
            const hashed_password = bcrypt.hashSync(password, saltRounds)
            let userObj = new User({email, username, hashed_password})
            this.db.collection("users").insertOne(userObj, (err, res) => {
                if (err) throw err
            })
            return userObj
        } else {
            return null
        }
    }

    async login(email, password) {
        let users = await this.queryUserByEmail(email)
        if (users.length === 1) {
            let user = users[0]
            let hashed_password = user.hashed_password
            if (await this.comparePassword(password, hashed_password) == true) {
                return user
            }
        }
        return null
    }

    async comparePassword(password, hashed_password) {
        console.log(password, hashed_password)
        try {
            return await bcrypt.compare(password, hashed_password);
        } catch (error) {
            throw error;
        }
    }

    async queryUserByEmail(email) {
        return await User.find({email: email})
    }

    async queryUserByUsername(username) {
        return await User.find({username: username})
    }

    async edit_store(store_id, name, description, image_url) {
        try {
            const objectId = new mongoose.Types.ObjectId(store_id);
            await this.db.collection("stores").updateOne(
                { _id: objectId },
                { $set: { name: name, description: description, image_url: image_url } }
            );
            console.log("Store updated");
            return true
        } catch (err) {
            console.error(err);
            return false
        }
    }
}

module.exports = {
    MongoDB
}