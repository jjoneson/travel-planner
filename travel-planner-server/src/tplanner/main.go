package main

import (
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
)

type Trip struct {
	Trip         string
	TripId       string
	Destinations interface{}
}

func main() {
	session, err := mgo.Dial("localhost")
	if err != nil {
		panic(err)
	}
	defer session.Close()

	c := session.DB("travel-planer").C("trips")
	err = c.Insert(&Trip{"999", "2", []int{1, 2}})

	if err != nil {
		log.Fatal(err)
	}

	result := Trip{}
	err = c.Find(bson.M{"trip": "999"}).One(&result)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Destinations:", result.Destinations)
}
