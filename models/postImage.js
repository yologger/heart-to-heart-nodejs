module.exports = (sequelize, Sequelize) => (
    sequelize.define('post_image', {
        url: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
    }, {
        freezeTableName: true,
        tableName: "post_image",
        underscored: true,
        timestamps: true,
        paranoid: true
    })
);