const mongoose = require('mongoose');
const NotFoundError = require('../exception/notFoundError.exception');
const Schema = mongoose.Schema;

const HomeSchema = new Schema(
    {
        creatorId: { type: Number, required: true },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: {
                street: { type: String, required: true, trim: true },
                province: { type: String, required: true, trim: true },
                district: { type: String, required: true, trim: true },
            },
            required: true,
            trim: true,
        },
        price: { type: Number, required: true },
        description: {
            type: [
                {
                    K: { type: String, required: true, trim: true },
                    V: { type: String, required: true, trim: true },
                },
            ],
            default: [],
        },
        area: { type: Number, required: true },
        image: {
            type: [String],
            required: true,
            default: [],
        },
        deletedAt: { type: Date, default: null },
        deleted: { type: Boolean, default: false },
        isSold: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

HomeSchema.index({ name: 'text' });
HomeSchema.index({ 'address.street': 'text' });
HomeSchema.index({ 'address.province': 'text' });
HomeSchema.index({ 'address.district': 'text' });
HomeSchema.index({ 'description.K': 'text' });
HomeSchema.index({ price: 1 });

const select = '-__v -address._id -description._id';

HomeSchema.statics.getHomes = async function (page, pageSize) {
    return await this.find({ deleted: false })
        .select(select)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });
};

HomeSchema.statics.getById = async function (_id) {
    const data = await this.findOne({ _id, deleted: false }).select(select);
    if (!data) {
        return new NotFoundError('home');
    }
    return { home: data, error: false };
};

HomeSchema.statics.getByIdAndCreatorId = async function (_id, creatorId) {
    const data = await this.findOne({ _id, creatorId, deleted: false }).select(select);
    if (!data) {
        return new NotFoundError('home');
    }
    return { home: data, error: false };
};

HomeSchema.statics.getByCreatorId = async function (creatorId) {
    return await this.find({ creatorId, deleted: false }).select(select);
};

HomeSchema.statics.deleteHomeById = async function (_id, creatorId) {
    const deleteHome = await this.findOneAndUpdate(
        { _id, creatorId },
        { deleted: true, deletedAt: Date.now() },
    );

    if (!deleteHome) {
        return new NotFoundError(`home with id ${_id}`);
    }

    return deleteHome;
};

HomeSchema.statics.updateHomeById = async function (_id, home, creatorId) {
    const updateHome = await this.findOneAndUpdate(
        { _id, creatorId, deleted: false },
        { $set: home },
        {
            new: true,
        },
    );
    if (!updateHome) {
        return new NotFoundError('home');
    }
    return updateHome;
};

HomeSchema.statics.searchHomes = async function (home, page, pageSize) {
    const { name, areaMore, areaLess, address, priceMore, priceLess } = home;
    let params = {
        deleted: false,
    };

    if (name) {
        params.name = { $regex: name, $options: 'i' };
    }

    if (priceMore || priceLess) {
        params.price = {};

        if (priceMore) {
            params.price = { $gte: parseFloat(priceMore) };
        }
        if (priceLess) {
            params.price = { $lte: parseFloat(priceLess), ...params.price };
        }
    }

    if (address) {
        const { province, district } = address;

        if (province) {
            params['address.province'] = { $regex: province, $options: 'i' };
        }
        if (district) {
            params['address.district'] = { $regex: district, $options: 'i' };
        }
    }

    if (areaMore || areaLess) {
        params.area = {};
        if (areaMore) {
            params.area = { $gte: parseFloat(areaMore) };
        }
        if (areaLess) {
            params.area = { $lte: parseFloat(areaLess), ...params.area };
        }
    }

    const data = await this.find(params)
        .select(select)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });
    return data;
};

const Home = mongoose.model('home', HomeSchema);

module.exports = Home;
