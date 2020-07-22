module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: true,
            unique: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        firstname: {
            type: DataTypes.STRING(25),
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING(25),
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING(25),
            allowNull: false
        }
    }, {
        timestamps: true,
        paranoid: true
    })
);