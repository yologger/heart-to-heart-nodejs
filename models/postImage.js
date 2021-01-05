module.exports = (sequelize, Sequelize) => (
    sequelize.define('postImage', {
        url: {
            type: Sequelize.STRING(300),
            allowNull: false
        }
    }, {
        freezeTableName: true,
        tableName: "post_image",
        underscored: true,
        timestamps: true,
        paranoid: true
    })
);