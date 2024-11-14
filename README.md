# Attendance-Register
##Admin register 
POST http://localhost:3000/admin/register
{
  "email": "admin1@shaper.co.za",
  "password": "@dmin@dmin@10001"
}
##Admin login 
POST http://localhost:3000/admin/login
{
  "email": "admin1@shaper.co.za",
  "password": "@dmin@dmin@10001"
}



##Admin create a user with admin Auth Token
POST http://localhost:3000/admin/create
{
  "employeeNumber": "S12344",
  "name": "Jane",
  "surname": "Doe",
  "image": "https://media.licdn.com/dms/image/v2/D4D03AQFW8F_Pr4ZUdw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723014220590?e=1736985600&v=beta&t=0gfSMF_75P5KRde507O6Zju6b8eVgnKRvnWH20d7KvI",
  "cohort": "2024",
   "geolocation": "{\"latitude\":40.7128,\"longitude\":-74.0060}"
  }


