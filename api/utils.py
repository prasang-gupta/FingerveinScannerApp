import os
import re
import mysql.connector

def get_database():
    mydb = mysql.connector.connect(
        host="fingervein-api-data.c7agb2tyg4gq.us-east-1.rds.amazonaws.com",
        user="admin",
        password="emtechiot",
        database="fingervein"
    )
    return mydb

def get_user_from_finger(val):
    mydb = get_database()
    cur = mydb.cursor()
    sqlquery = "SELECT first, last, email FROM apidata WHERE fingertemplate = %s"
    sqldata = (val, )
    cur.execute(sqlquery, sqldata)
    res = cur.fetchall()
    mydb.close()
    if res == []:
        return -1, {}

    data = {"first" : res[0][0],
            "last" : res[0][1],
            "email" : res[0][2]}
    return 0, data

def check_email_exist(val):
    mydb = get_database()
    cur = mydb.cursor()
    sqlquery = "SELECT COUNT(*) FROM apidata WHERE email = %s"
    sqldata = (val, )
    cur.execute(sqlquery, sqldata)
    res = cur.fetchall()
    mydb.close()
    if res[0][0]:
        return 1
    return 0

def add_datapoint(newval):
    mydb = get_database()
    cur = mydb.cursor()
    sqlquery = "SELECT COUNT(*) FROM apidata WHERE email = %s"
    sqldata = (newval["email"], )
    cur.execute(sqlquery, sqldata)
    res = cur.fetchall()
    if res[0][0]:
        mydb.close()
        return 0
    
    sqlquery = "INSERT INTO apidata (first, last, email, fingertemplate, fingerverificationtemplate) VALUES (%s, %s, %s, %s, %s)"
    sqldata = (newval["first"], newval["last"], newval["email"], newval["fingertemplate"], newval["fingerverificationtemplate"])
    cur.execute(sqlquery, sqldata)
    mydb.commit()
    mydb.close()
    return 1

def delete_email(val):
    mydb = get_database()
    cur = mydb.cursor()
    sqlquery = "DELETE FROM apidata WHERE email = %s"
    sqldata = (val, )
    cur.execute(sqlquery, sqldata)
    mydb.commit()
    mydb.close()
    return cur.rowcount

def reset_database():
    mydb = get_database()
    cur = mydb.cursor()
    sqlquery = "DELETE FROM apidata"
    cur.execute(sqlquery)
    mydb.commit()
    mydb.close()
    return cur.rowcount

def get_alldata():
    mydb = get_database()
    cur = mydb.cursor()
    sqlquery = "SELECT * FROM apidata"
    cur.execute(sqlquery)
    a = cur.fetchall()
    mydb.close()

    alldata = []
    for obj in a:
        curdata = {
            "first" : obj[0],
            "last" : obj[1],
            "email" : obj[2],
            "fingertemplate" : obj[3],
            "fingerverificationtemplate" : obj[4]
        }
        alldata.append(curdata)
    return alldata