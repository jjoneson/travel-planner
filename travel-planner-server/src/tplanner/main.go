package main

import (
	"encoding/json"
	"fmt"
	"github.com/julienschmidt/httprouter"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	"log"
	"net/http"
)

type Trip struct {
	Name         string
	TripId       string
	Destinations interface{}
}

func Save(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	session, err := mgo.Dial("localhost")
	if err != nil {
		fmt.Fprint(w, err)
		return
	}
	defer session.Close()
	bytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprint(w, err)
		return
	}

	trip := Trip{}
	err = json.Unmarshal(bytes, &trip)

	c := session.DB("travel-planner").C("trips")
	q := bson.M{"name": trip.Name}
	_, err = c.Upsert(q, &trip)
	err = c.Find(bson.M{"name": trip.Name}).One(&trip)
	bytes, err = json.Marshal(trip)
	fmt.Fprint(w, string(bytes))
}

func Load(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	session, err := mgo.Dial("localhost")
	if err != nil {
		fmt.Fprint(w, err)
		return
	}
	defer session.Close()

	c := session.DB("travel-planner").C("trips")
	trip := Trip{}
	err = c.Find(bson.M{"name": r.URL.Query().Get("name")}).One(&trip)
	if err != nil {
		fmt.Fprint(w, err)
		return
	}

	o, err := json.Marshal(trip)

	if err != nil {
		fmt.Fprint(w, err)
	}

	fmt.Fprint(w, string(o))
}

func main() {
	router := httprouter.New()
	router.GET("/load", Load)
	router.POST("/save", Save)
	log.Fatal(http.ListenAndServe("localhost:997", router))
}
