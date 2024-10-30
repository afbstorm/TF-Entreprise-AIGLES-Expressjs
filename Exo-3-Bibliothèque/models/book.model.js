module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1800,
                max: new Date().getFullYear()
            }
        }
    });

    Book.associate = (models) => {
        Book.belongsTo(models.Author, {
            foreignKey: 'authorId',
            as: 'author'
        });
    };

    return Book;
};
