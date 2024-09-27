const bcrypt = require("bcrypt");
const { prismaConnection } = require("./prisma/prisma");

const password = "123456789";
const hashedPassword = bcrypt.hashSync(password, 10);

const seedUsers = [
    // 10 customers
    {
        name: "John Doe",
        email: "john.doe@example.com",
        password: hashedPassword,
        imagesUrl: "https://media.istockphoto.com/id/1389348844/fr/photo/plan-de-studio-dune-belle-jeune-femme-souriante-debout-sur-un-fond-gris.jpg?s=612x612&w=0&k=20&c=VGipX3a8xrbYuXTNm_61pFuzpGdAO9lwt2xnVUd7Khs=",
        balance: 123.45,
        location: {
            type: 'Point',
            coordinates: [10.16579, 36.80611] // Tunis
        },
        role: "customer"
    },
    {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: hashedPassword,
        imagesUrl: "https://media.istockphoto.com/id/682897825/fr/photo/confident-businesswoman-over-gray-background.jpg?s=612x612&w=0&k=20&c=OcDGuIswfOhS21Fwg_uxb6O8MXEQK5IrjMqkguihdAk=",
        balance: 234.56,
        location: {
            type: 'Point',
            coordinates: [10.102, 35.6781] // Sfax
        },
        role: "customer"
    },
    {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        password: hashedPassword,
        imagesUrl: "https://media.istockphoto.com/id/1171169099/fr/photo/homme-avec-les-bras-crois%C3%A9s-disolement-sur-le-fond-gris.jpg?s=612x612&w=0&k=20&c=csQeB3utGtrGeb3WmdSxRYXaJvUy_xqlhbOIZxclcGA=",
        balance: 345.67,
        location: {
            type: 'Point',
            coordinates: [10.6347, 35.8256] // Monastir
        },
        role: "customer"
    },
    {
        name: "Bob Brown",
        email: "bob.brown@example.com",
        password: hashedPassword,
        imagesUrl: "https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg",
        balance: 456.78,
        location: {
            type: 'Point',
            coordinates: [10.6105, 34.7441] // Gabès
        },
        role: "customer"
    },
    {
        name: "Charlie Davis",
        email: "charlie.davis@example.com",
        password: hashedPassword,
        imagesUrl: "https://media.istockphoto.com/id/1386479313/fr/photo/heureuse-femme-daffaires-afro-am%C3%A9ricaine-mill%C3%A9naire-posant-isol%C3%A9e-sur-du-blanc.jpg?s=612x612&w=0&k=20&c=CS0xj40eNCorQyzN1ImeMKlvPDocPHSaMsXethQ-Q_g=",
        balance: 567.89,
        location: {
            type: 'Point',
            coordinates: [8.7483, 36.4573] // Tabarka
        },
        role: "customer"
    },
    {
        name: "Diana Evans",
        email: "diana.evans@example.com",
        password: hashedPassword,
        imagesUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKdG3zlo6rsY1oNgUyNAvPLl96-OGHAswLvQ&s",
        balance: 678.90,
        location: {
            type: 'Point',
            coordinates: [9.3708, 37.2783] // Bizerte
        },
        role: "customer"
    },
    {
        name: "Emily Foster",
        email: "emily.foster@example.com",
        password: hashedPassword,
        imagesUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Old_woman_in_Kyrgyzstan%2C_2010.jpg/800px-Old_woman_in_Kyrgyzstan%2C_2010.jpg",
        balance: 789.01,
        location: {
            type: 'Point',
            coordinates: [9.5369, 35.6769] // Kairouan
        },
        role: "customer"
    },
    {
        name: "Frank Garcia",
        email: "frank.garcia@example.com",
        password: hashedPassword,
        imagesUrl: "https://www.le7.info/media/cache/article/uploads/photos/64101bd1e383a.jpeg",
        balance: 890.12,
        location: {
            type: 'Point',
            coordinates: [9.4811, 35.5056] // Sbeitla
        },
        role: "customer"
    },
    {
        name: "Grace Harris",
        email: "grace.harris@example.com",
        password: hashedPassword,
        imagesUrl: "https://www.le7.info/media/cache/article/uploads/photos/64101bd1e383a.jpeg",
        balance: 901.23,
        location: {
            type: 'Point',
            coordinates: [9.7489, 33.5031] // Gafsa
        },
        role: "customer"
    },
    {
        name: "Hannah Ivers",
        email: "hannah.ivers@example.com",
        password: hashedPassword,
        imagesUrl: "https://www.soladis.com/wp-content/uploads/2017/06/personne-1-1.png",
        balance: 123.45,
        location: {
            type: 'Point',
            coordinates: [10.0971, 33.8815] // Djerba
        },
        role: "customer"
    },
    
    // 20 restaurant owners
    {
        name: "Isabella Jones",
        email: "isabella.jones@example.com",
        password: hashedPassword,
        imagesUrl: "https://www.restoconnection.fr/wp-content/uploads/2015/02/fa%C3%A7ade-restaurant-architecture-sake-manzo-bejing.jpg",
        balance: 234.56,
        location: {
            type: 'Point',
            coordinates: [10.0971, 33.8815] // Djerba
        },
        role: "restaurant_owner"
    },
    {
        name: "Jack King",
        email: "jack.king@example.com",
        password: hashedPassword,
        imagesUrl: "https://www.createursdinterieur.com/static/4fc8ce556e777abdb2ba81b6a1f4d368/4b190/facade-restaurant-renove-architecte.jpg",
        balance: 345.67,
        location: {
            type: 'Point',
            coordinates: [10.6347, 35.8256] // Monastir
        },
        role: "restaurant_owner"
    },
    {
        name: "Katherine Lee",
        email: "katherine.lee@example.com",
        password: hashedPassword,
        imagesUrl: "https://media-cdn.tripadvisor.com/media/photo-s/0b/22/45/43/facade-du-restaurant.jpg",
        balance: 456.78,
        location: {
            type: 'Point',
            coordinates: [9.7489, 33.5031] // Gafsa
        },
        role: "restaurant_owner"
    },
    {
        name: "Liam Martinez",
        email: "liam.martinez@example.com",
        password: hashedPassword,
        imagesUrl: "https://i.pinimg.com/originals/ca/01/4d/ca014dfc3a8d3b6162d9066c2ab24e2d.jpg",
        balance: 567.89,
        location: {
            type: 'Point',
            coordinates: [9.4811, 35.5056] // Sbeitla
        },
        role: "restaurant_owner"
    },
    {
        name: "Mia Nelson",
        email: "mia.nelson@example.com",
        password: hashedPassword,
        imagesUrl: "https://zupimages.net/up/15/25/pm7h.jpg",
        balance: 678.90,
        location: {
            type: 'Point',
            coordinates: [10.16579, 36.80611] // Tunis
        },
        role: "restaurant_owner"
    },
    {
        name: "Noah Ortiz",
        email: "noah.ortiz@example.com",
        password: hashedPassword,
        imagesUrl: "https://s6.gifyu.com/images/restaurantfaadepescaderia.jpg",
        balance: 789.01,
        location: {
            type: 'Point',
            coordinates: [10.2104, 35.4567] // Sfax
        },
        role: "restaurant_owner"
    },
    {
        name: "Olivia Perez",
        email: "olivia.perez@example.com",
        password: hashedPassword,
        imagesUrl: "https://media-cdn.tripadvisor.com/media/photo-s/0c/0b/11/65/poulpe-grille.jpg",
        balance: 890.12,
        location: {
            type: 'Point',
            coordinates: [10.0971, 35.8256] // Monastir
        },
        role: "restaurant_owner"
    },
    {
        name: "Pablo Rodriguez",
        email: "pablo.rodriguez@example.com",
        password: hashedPassword,
        imagesUrl: "https://cdn.pixabay.com/photo/2017/06/23/12/04/facade-2431004_1280.jpg",
        balance: 901.23,
        location: {
            type: 'Point',
            coordinates: [9.5369, 35.6769] // Kairouan
        },
        role: "restaurant_owner"
    },
    {
        name: "Quinn Thomas",
        email: "quinn.thomas@example.com",
        password: hashedPassword,
        imagesUrl: "https://cdn.pixabay.com/photo/2020/02/02/14/33/restaurants-4783520_1280.jpg",
        balance: 1010.34,
        location: {
            type: 'Point',
            coordinates: [10.6347, 35.8256] // Monastir
        },
        role: "restaurant_owner"
    },
    {
        name: "Riley White",
        email: "riley.white@example.com",
        password: hashedPassword,
        imagesUrl: "https://cdn.pixabay.com/photo/2020/06/25/15/01/restaurant-5521964_1280.jpg",
        balance: 1120.45,
        location: {
            type: 'Point',
            coordinates: [10.5012, 35.7896] // Monastir
        },
        role: "restaurant_owner"
    },
    {
        name: "Sophia Young",
        email: "sophia.young@example.com",
        password: hashedPassword,
        imagesUrl: "https://cdn.pixabay.com/photo/2020/07/20/18/42/pizza-4522138_1280.jpg",
        balance: 1234.56,
        location: {
            type: 'Point',
            coordinates: [9.8713, 34.9876] // Kairouan
        },
        role: "restaurant_owner"
    },
];

async function main() {
    // Clear existing users
    await prismaConnection.user.deleteMany({});

    // Create users
    await prismaConnection.user.createMany({
        data: seedUsers,
    });

    console.log("Users inserted successfully.");
}

main()
    .catch((error) => {
        console.error("Error inserting users:", error);
    })
    .finally(async () => {
        await prismaConnection.$disconnect();
    });
