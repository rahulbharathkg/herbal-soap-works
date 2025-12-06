
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../backend/dev.sqlite');
const dbPathFallback = path.resolve(__dirname, '../database.sqlite');

let dbFile = dbPath;
import fs from 'fs';
if (!fs.existsSync(dbPath)) {
    if (fs.existsSync(dbPathFallback)) {
        dbFile = dbPathFallback;
    } else {
        console.error('No database found at', dbPath, 'or', dbPathFallback);
        process.exit(1);
    }
}

console.log('Using database:', dbFile);

const db = new sqlite3.Database(dbFile);

db.serialize(() => {
    db.get("SELECT * FROM admin_content WHERE key = 'home_layout'", (err, row) => {
        if (err) {
            console.error('Error fetching layout:', err);
            db.close();
            return;
        }
        if (row) {
            try {
                const blocks = JSON.parse(row.value);
                const customBlockIndex = blocks.findIndex(b => b.content.title === 'Create Your Own Soap');

                if (customBlockIndex !== -1) {
                    blocks[customBlockIndex].content = {
                        ...blocks[customBlockIndex].content,
                        link: '/custom-soap',
                        buttonText: 'Start Creating',
                        bgcolor: '#4a148c',
                        backgroundImage: 'https://placehold.co/1920x600/4a148c/ffffff?text=Custom+Soap+Builder',
                        subtitle: 'Choose your base, scents, and ingredients. Visualize your creation instantly.'
                    };

                    const newValue = JSON.stringify(blocks);
                    db.run("UPDATE admin_content SET value = ? WHERE key = 'home_layout'", [newValue], function (err) {
                        if (err) {
                            console.error('Error updating layout:', err);
                        } else {
                            console.log('Successfully updated home_layout');
                        }
                        db.close();
                    });
                } else {
                    console.log('Customization block not found');
                    db.close();
                }
            } catch (e) {
                console.error('Error parsing JSON:', e);
                db.close();
            }
        } else {
            console.log('home_layout not found');
            db.close();
        }
    });
});
