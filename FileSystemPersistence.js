const fs = require('fs');
const readline = require('readline');
const mkdirp = require('mkdirp');
const Persistence = require('./Persistence');
const Event = require('./Event');

class FileSystemPersistence extends Persistence {
  load(loadCallback) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(this.getFileName());
      const reader = readline.createInterface({ input: readStream });
      let readError;

      readStream.on('error', (error) => {
        if (error.code !== 'ENOENT') {
          readError = error;
        }
        reader.close();
      });

      reader.on('line', (line) => {
        try {
          if (line && line.trim()) {
            const data = JSON.parse(line);
            const className = data.class;
            delete data.class;

            const EventConstructor = this.supportedEventConstructors.get(className);
            if (!EventConstructor) {
              throw new Error(`The event constructor ${className} could not be found`);
            }

            loadCallback(new EventConstructor(data));
          }
        } catch (error) {
          readError = error;
          reader.close();
        }
      });

      reader.on('close', () => {
        if (readError) {
          reject(readError);
        } else {
          resolve();
        }
      });
    });
  }

  append(event) {
    return new Promise((resolve, reject) => {
      if (!(event instanceof Event)) {
        reject(new Error('Must be instance of Event'));
      } else {
        const data = event.toObject();
        data.class = event.constructor.name;
        mkdirp(this.getFilePath(), (directoryError) => {
          if (directoryError) {
            reject(directoryError);
          } else {
            const line = `${JSON.stringify(data)}\n`;
            fs.appendFile(this.getFileName(), line, (appendError) => {
              if (appendError) {
                reject(appendError);
              } else {
                resolve();
              }
            });
          }
        });
      }
    });
  }

  clear() {
    return new Promise((resolve, reject) => {
      fs.unlink(this.getFileName(), (error) => {
        if (error) {
          if (error.code === 'ENOENT') {
            resolve();
          } else {
            reject(error);
          }
        } else {
          resolve();
        }
      });
    });
  }

  getFilePath() {
    return 'data';
  }

  getFileName() {
    return `${this.getFilePath()}/${this.id}.data`;
  }
}

module.exports = FileSystemPersistence;
