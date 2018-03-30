# FLEET7

## General Information

**Tournament:**   EVA AI Hackathon - The Battle Ships game
**Team name:** Hạm Đội 7
**Contributors:**

  - Lý Vĩnh Trường - truong.ly@gmail.com
  - Trần Gia Minh - trangiaminh@gmail.com
  - Tôn Thất Quốc Cường - ttquoccuong@gmail.com


## Technical

- Platform: NodeJS - https://nodejs.org/
- Framework: Sails JS - https://sailsjs.com/
- Database: mySQL v5.6~


## Setting up project:

**1. Setup source code: **

```
cd /path/to/projects/

git clone https://truong_ly@bitbucket.org/fleet7/fleet7.git

cd fleet7/app
```

**2. Setup database:**

- Create a mySQL database

- Open file ```config/connections.js```

   - Find 'localMysqlServer', edit the connection information

**3. Build app:**

3.1. Install NodeJS

3.2. Install Sails JS Framework

Run commands:

```
npm install sails -g    
npm install sails-mysql
```

3.3. Declare team ID for app:
  
Run command:
   
```
sails console   
> AppSetings.create({key:"FLEET7", value:"ham_doi_7"}).exec(console.log)
```
   
Press Ctrl+C two times to exit


3.4. To start app, run command:

```
sails lift
```
   

***Note:***

_You have to publish port 1337 so that the game engine can connect to this app_
