import random, string, argparse

first_names = ['Jack', 'Oliver', 'James', 'Charlie', 'Harris', 'Lewis', 'Leo', 'Noah', 'Alfie', 'Rory', 'Alexander', 'Max', 'Logan', 'Lucas', 'Harry', 'Theo', 'Thomas', 'Brodie', 'Archie', 'Jacob', 'Finlay', 'Finn', 'Daniel', 'Joshua', 'Oscar', 'Arthur', 'Hunter', 'Ethan', 'Mason', 'Harrison', 'Freddie', 'Ollie', 'Adam', 'William', 'Jaxon', 'Aaron', 'Cameron', 'Liam', 'George', 'Jamie', 'Callum', 'Matthew', 'Muhammad', 'Caleb', 'Nathan', 'Tommy', 'Carter', 'Blake', 'Andrew', 'Luke', 'Jude', 'Angus', 'Riley', 'Luca', 'Samuel', 'Joseph', 'David', 'Isaac', 'Ryan', 'Hamish', 'Sonny', 'Arlo', 'Arran', 'Cole', 'Robert', 'Blair', 'Dylan', 'Louie', 'Ruaridh', 'Connor', 'Benjamin', 'Kai', 'Michael', 'Jackson', 'Leon', 'Cooper', 'Louis', 'Theodore', 'Fraser', 'Owen', 'Reuben', 'John', 'Carson', 'Innes', 'Elijah', 'Murray', 'Grayson', 'Aiden', 'Aidan', 'Cody', 'Elliot', 'Ben', 'Henry', 'Sam', 'Alex', 'Ellis', 'Gabriel', 'Jax', 'Callan', 'Ruairidh', 'Frankie', 'Lachlan', 'Roman', 'Brody', 'Josh', 'Sebastian', 'Struan', 'Evan', 'Kyle', 'Myles', 'Calum', 'Lochlan', 'Jayden', 'Lyle', 'Robbie', 'Calvin', 'Corey', 'Jaxson', 'Christopher', 'Teddy', 'Eli', 'Marcus', 'Parker', 'Tyler', 'Euan', 'Hudson', 'Joey', 'Austin', 'Zac', 'Dominic', 'Kayden', 'Zack', 'Harvey', 'Rowan', 'Hugo', 'Edward', 'Fergus', 'Finley', 'Patrick', 'Cillian', 'Conor', 'Ruben', 'Flynn', 'Jake', 'Albie', 'Levi', 'Mohammad', 'Rhys', 'Ronan', 'Zach', 'Zachary', 'Ezra', 'Charles', 'Kian', 'Kieran', 'Mohammed', 'Zak', 'Anthony', 'Bradley', 'Elliott', 'Mark', 'Miller', 'Felix', 'Harley', 'Jay', 'Jordan', 'Milo', 'Oran', 'Peter', 'Sean', 'Ciaran', 'Jasper', 'Kaiden', 'Robin', 'Caelan', 'Cohen', 'Magnus', 'Xander', 'Jason', 'Reece', 'Ruairi', 'Scott', 'Cian', 'Filip', 'Nico', 'Olly', 'Gregor', 'Junior', 'Antoni', 'Colton', 'Jenson', 'Layton', 'Ross']

last_names = ['SMITH', 'JOHNSON', 'WILLIAMS', 'BROWN', 'JONES', 'GARCIA', 'MILLER', 'DAVIS', 'RODRIGUEZ', 'MARTINEZ', 'HERNANDEZ', 'LOPEZ', 'GONZALEZ', 'WILSON', 'ANDERSON', 'THOMAS', 'TAYLOR', 'MOORE', 'JACKSON', 'MARTIN', 'LEE', 'PEREZ', 'THOMPSON', 'WHITE', 'HARRIS', 'SANCHEZ', 'CLARK', 'RAMIREZ', 'LEWIS', 'ROBINSON', 'WALKER', 'YOUNG', 'ALLEN', 'KING', 'WRIGHT', 'SCOTT', 'TORRES', 'NGUYEN', 'HILL', 'FLORES', 'GREEN', 'ADAMS', 'NELSON', 'BAKER', 'HALL', 'RIVERA', 'CAMPBELL', 'MITCHELL', 'CARTER', 'ROBERTS', 'GOMEZ', 'PHILLIPS', 'EVANS', 'TURNER', 'DIAZ', 'PARKER', 'CRUZ', 'EDWARDS', 'COLLINS', 'REYES', 'STEWART', 'MORRIS', 'MORALES', 'MURPHY', 'COOK', 'ROGERS', 'GUTIERREZ', 'ORTIZ', 'MORGAN', 'COOPER', 'PETERSON', 'BAILEY', 'REED', 'KELLY', 'HOWARD', 'RAMOS', 'KIM', 'COX', 'WARD', 'RICHARDSON', 'WATSON', 'BROOKS', 'CHAVEZ', 'WOOD', 'JAMES', 'BENNETT', 'GRAY', 'MENDOZA', 'RUIZ', 'HUGHES', 'PRICE', 'ALVAREZ', 'CASTILLO', 'SANDERS', 'PATEL', 'MYERS', 'LONG', 'ROSS', 'FOSTER', 'JIMENEZ', 'POWELL', 'JENKINS', 'PERRY', 'RUSSELL', 'SULLIVAN', 'BELL', 'COLEMAN', 'BUTLER', 'HENDERSON', 'BARNES', 'GONZALES', 'FISHER', 'VASQUEZ', 'SIMMONS', 'ROMERO', 'JORDAN', 'PATTERSON', 'ALEXANDER', 'HAMILTON', 'GRAHAM', 'REYNOLDS', 'GRIFFIN', 'WALLACE', 'MORENO', 'WEST', 'COLE', 'HAYES', 'BRYANT', 'HERRERA', 'GIBSON', 'ELLIS', 'TRAN', 'MEDINA', 'AGUILAR', 'STEVENS', 'MURRAY', 'FORD', 'CASTRO', 'MARSHALL', 'OWENS', 'HARRISON', 'FERNANDEZ', 'MCDONALD', 'WOODS', 'WASHINGTON', 'KENNEDY', 'WELLS', 'VARGAS', 'HENRY', 'CHEN', 'FREEMAN', 'WEBB', 'TUCKER', 'GUZMAN', 'BURNS', 'CRAWFORD', 'OLSON', 'SIMPSON', 'PORTER', 'HUNTER', 'GORDON', 'MENDEZ', 'SILVA', 'SHAW', 'SNYDER', 'MASON', 'DIXON', 'MUNOZ', 'HUNT', 'HICKS', 'HOLMES', 'PALMER', 'WAGNER', 'BLACK', 'ROBERTSON', 'BOYD', 'ROSE', 'STONE', 'SALAZAR', 'FOX', 'WARREN', 'MILLS', 'MEYER', 'RICE', 'SCHMIDT', 'GARZA', 'DANIELS', 'FERGUSON', 'NICHOLS', 'STEPHENS', 'SOTO', 'WEAVER', 'RYAN', 'GARDNER', 'PAYNE', 'GRANT', 'DUNN', 'KELLEY', 'SPENCER', 'HAWKINS', 'ARNOLD', 'PIERCE', 'VAZQUEZ', 'HANSEN', 'PETERS', 'SANTOS', 'HART', 'BRADLEY', 'KNIGHT', 'ELLIOTT', 'CUNNINGHAM', 'DUNCAN', 'ARMSTRONG', 'HUDSON', 'CARROLL', 'LANE', 'RILEY', 'ANDREWS', 'ALVARADO', 'RAY', 'DELGADO', 'BERRY', 'PERKINS', 'HOFFMAN', 'JOHNSTON', 'MATTHEWS', 'PENA', 'RICHARDS', 'CONTRERAS', 'WILLIS', 'CARPENTER', 'LAWRENCE', 'SANDOVAL', 'GUERRERO', 'GEORGE', 'CHAPMAN', 'RIOS', 'ESTRADA', 'ORTEGA', 'WATKINS', 'GREENE', 'NUNEZ', 'WHEELER', 'VALDEZ', 'HARPER', 'BURKE', 'LARSON', 'SANTIAGO', 'MALDONADO', 'MORRISON', 'FRANKLIN', 'CARLSON', 'AUSTIN', 'DOMINGUEZ', 'CARR', 'LAWSON', 'JACOBS', 'OBRIEN', 'LYNCH', 'SINGH', 'VEGA', 'BISHOP', 'MONTGOMERY', 'OLIVER', 'JENSEN', 'HARVEY', 'WILLIAMSON', 'GILBERT', 'DEAN', 'SIMS', 'ESPINOZA', 'HOWELL', 'LI', 'WONG', 'REID', 'HANSON', 'LE', 'MCCOY', 'GARRETT', 'BURTON', 'FULLER', 'WANG', 'WEBER', 'WELCH', 'ROJAS', 'LUCAS', 'MARQUEZ', 'FIELDS', 'PARK', 'YANG', 'LITTLE', 'BANKS', 'PADILLA', 'DAY', 'WALSH', 'BOWMAN', 'SCHULTZ', 'LUNA', 'FOWLER', 'MEJIA', 'DAVIDSON', 'ACOSTA', 'BREWER', 'MAY', 'HOLLAND', 'JUAREZ', 'NEWMAN', 'PEARSON', 'CURTIS', 'CORTEZ', 'DOUGLAS', 'SCHNEIDER', 'JOSEPH', 'BARRETT', 'NAVARRO', 'FIGUEROA', 'KELLER', 'AVILA', 'WADE', 'MOLINA', 'STANLEY', 'HOPKINS', 'CAMPOS', 'BARNETT', 'BATES', 'CHAMBERS', 'CALDWELL', 'BECK', 'LAMBERT', 'MIRANDA', 'BYRD', 'CRAIG', 'AYALA', 'LOWE', 'FRAZIER', 'POWERS', 'NEAL', 'LEONARD', 'GREGORY', 'CARRILLO', 'SUTTON', 'FLEMING', 'RHODES', 'SHELTON', 'SCHWARTZ', 'NORRIS', 'JENNINGS', 'WATTS', 'DURAN', 'WALTERS', 'COHEN', 'MCDANIEL', 'MORAN', 'PARKS', 'STEELE', 'VAUGHN', 'BECKER', 'HOLT', 'DELEON', 'BARKER', 'TERRY', 'HALE', 'LEON', 'HAIL', 'BENSON', 'HAYNES', 'HORTON', 'MILES', 'LYONS', 'PHAM', 'GRAVES', 'BUSH', 'THORNTON', 'WOLFE', 'WARNER', 'CABRERA', 'MCKINNEY', 'MANN', 'ZIMMERMAN', 'DAWSON', 'LARA', 'FLETCHER', 'PAGE', 'MCCARTHY', 'LOVE', 'ROBLES', 'CERVANTES', 'SOLIS', 'ERICKSON', 'REEVES', 'CHANG', 'KLEIN', 'SALINAS', 'FUENTES', 'BALDWIN', 'DANIEL', 'SIMON', 'VELASQUEZ', 'HARDY', 'HIGGINS', 'AGUIRRE', 'LIN', 'CUMMINGS', 'CHANDLER', 'SHARP', 'BARBER', 'BOWEN', 'OCHOA', 'DENNIS', 'ROBBINS', 'LIU', 'RAMSEY', 'FRANCIS', 'GRIFFITH', 'PAUL', 'BLAIR', 'OCONNOR', 'CARDENAS', 'PACHECO', 'CROSS', 'CALDERON', 'QUINN', 'MOSS', 'SWANSON', 'CHAN', 'RIVAS', 'KHAN', 'RODGERS', 'SERRANO', 'FITZGERALD', 'ROSALES', 'STEVENSON', 'CHRISTENSEN', 'MANNING', 'GILL', 'CURRY', 'MCLAUGHLIN', 'HARMON', 'MCGEE', 'GROSS', 'DOYLE', 'GARNER', 'NEWTON', 'BURGESS', 'REESE', 'WALTON', 'BLAKE', 'TRUJILLO', 'ADKINS', 'BRADY', 'GOODMAN', 'ROMAN', 'WEBSTER', 'GOODWIN', 'FISCHER', 'HUANG', 'POTTER', 'DELACRUZ', 'MONTOYA', 'TODD', 'WU', 'HINES', 'MULLINS', 'CASTANEDA', 'MALONE', 'CANNON', 'TATE', 'MACK', 'SHERMAN', 'HUBBARD', 'HODGES', 'ZHANG', 'GUERRA', 'WOLF', 'VALENCIA', 'SAUNDERS', 'FRANCO', 'ROWE', 'GALLAGHER', 'FARMER', 'HAMMOND', 'HAMPTON', 'TOWNSEND', 'INGRAM', 'WISE', 'GALLEGOS', 'CLARKE', 'BARTON', 'SCHROEDER', 'MAXWELL', 'WATERS', 'LOGAN', 'CAMACHO', 'STRICKLAND', 'NORMAN', 'PERSON', 'COLON']

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('user_count', type=int, nargs='+', help='Enter the number of users you want to generate')
    parser.add_argument('-s', '--start-index', type=int, nargs='?', default=1, help='Start the list of users from this index')
    args = parser.parse_args()

    if args.start_index < 0:
        args.start_index = 1
    
    for _ in range(args.start_index, args.start_index + args.user_count[0]):
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        last_name = last_name[0] + last_name[1:].lower()
        password = string.ascii_letters + string.digits + '_!#$%^&*'
        print('"user', _, '" : {', sep='')
        print('  "First_Name" : "', first_name, '",', sep='')
        print('  "First_Name" : "', last_name, '",', sep='')
        print('  "StudentID" : "', ''.join([random.choice(string.digits) for _ in range(9)]), '",', sep='')
        print('  "Username" : "', ''.join([first_name[_] for _ in range(min(int(random.choice(string.digits)), len(first_name)))]),  ''.join([last_name[_] for _ in range(min(int(random.choice(string.digits)), len(last_name)))]), ''.join([random.choice(string.digits) for _ in range((int(random.choice(string.digits)) + int(random.choice(string.digits))) // 2)]), '",', sep='')
        print('  "Password" : "', ''.join([random.choice(password) for _ in range(8, 21)]), '"', sep='')
        print('},')
        

if __name__=='__main__':
    main()
