// Function to generate a random company name
function generateRandomCompanyName() {

    // Lists of words and phrases
    const singleWords = [
        "Tech", "Global", "Visionary", "Pinnacle", "NextGen",
        "Skyline", "Quantum", "Elite", "Infinity", "Fusion",
        "Apex", "Vertex", "Synergy", "Crystal", "Elevate",
        "Bright", "Proactive", "Evergreen", "Streamline", "Nimbus",
        "Fortune", "Epicenter", "Horizon", "Nova", "Prime",
        "Crestline", "Agile", "Matrix", "Zenith", "Vanguard",
        "Summit", "Evolve", "Trinity", "Omni", "Sapphire",
        "Silverline", "Frontier", "Lighthouse", "Titan", "Inspire",
        "Nexus", "Catalyst", "Momentum", "Vortex", "Accelerate",
        "Aspire", "Radiant", "Solstice", "Aurora", "Centric"
    ];

    const twoWords = [
        "Innovators Inc.", "Solutions Ltd.", "Systems Corp.", "Technologies LLC", "Enterprises Inc.",
        "Industries Co.", "Dynamics Ltd.", "Software Group", "Networks Inc.", "Labs LLC",
        "Innovations Inc.", "Solutions Corp.", "Enterprises Ltd.", "Technologies Corp.", "Holdings LLC",
        "Systems Inc.", "Ventures Ltd.", "Software Solutions", "Tech Solutions", "Innovations Group",
        "Technologies Inc.", "Labs Corp.", "Industries Ltd.", "Corp. Ltd.", "Solutions Group",
        "Ventures LLC", "Systems Group", "Dynamics Corp.", "Technologies Ltd.", "Innovations LLC",
        "Software Inc.", "Technologies Group", "Software Labs", "Solutions Inc.", "Systems Corp.",
        "Technologies Co.", "Labs Inc.", "Innovations Ltd.", "Technologies Ventures", "Solutions LLC",
        "Technologies Inc.", "Software Dynamics", "Technologies Solutions", "Enterprises Corp.", "Tech Ventures",
        "Labs Ltd.", "Software Solutions", "Industries Ltd.", "Technologies Group", "Systems Solutions"
    ];
    const randomSingleWord = singleWords[Math.floor(Math.random() * singleWords.length)];
    const randomTwoWords = twoWords[Math.floor(Math.random() * twoWords.length)];
    return `${randomSingleWord} ${randomTwoWords}`;
}

function generateVehicleName() {
    const vehicleNames = [
        "Falcon", "Thunderbolt", "Shadow", "Steel", "Vortex",
        "Ironclad", "Starlight", "Phoenix", "Raven", "Avalanche",
        "Lightning", "Optic", "Predator", "Nebula", "Silver",
        "Tornado", "Eclipse", "Jaguar", "Maverick", "Crimson",
        "Blaze", "Viper", "Cyclone", "Inferno", "Granite",
        "Vanguard", "Mirage", "Sphinx", "Onyx", "Titanium",
        "Comet", "Specter", "Scorpion", "Nemesis", "Hurricane",
        "Firestorm", "Volcano", "Peregrine", "Nitro", "Panther",
        "Obsidian", "Artemis", "Sonic", "Striker", "Aegis",
        "Phantom", "Zephyr", "Tempest", "Raider", "Quasar"
    ];
    return vehicleNames[Math.floor(Math.random() * vehicleNames.length)];
}

function generateDriverName() {
    const driverNames = [
        "Olivia", "Liam", "Emma", "Noah", "Ava",
        "Oliver", "Sophia", "Elijah", "Isabella", "James",
        "Mia", "Benjamin", "Charlotte", "Lucas", "Amelia",
        "Henry", "Harper", "Alexander", "Evelyn", "Mason",
        "Abigail", "Michael", "Ella", "Ethan", "Scarlett",
        "Daniel", "Grace", "Jacob", "Chloe", "Logan",
        "Victoria", "Jackson", "Aria", "Levi", "Madison",
        "Sebastian", "Luna", "Mateo", "Penelope", "Jack",
        "Layla", "Owen", "Riley", "Theodore", "Zoey",
        "Aiden", "Nora", "Samuel", "Lily", "Joseph"
    ];
    return driverNames[Math.floor(Math.random()*driverNames.length)]    
}

module.exports = {generateRandomCompanyName, generateVehicleName, generateDriverName}
