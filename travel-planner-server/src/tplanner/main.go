package main

import (
	"aurora"
	"encoding/json"
	"fmt"
	"github.com/julienschmidt/httprouter"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
)

type Trip struct {
	Name         string
	TripId       string
	Destinations interface{}
}

func GetMap(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprint(w, aurora.CreateMap())
}

func GetKnownAuroraOdds(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	knownPlace := r.URL.Query().Get("place")

	for _, place := range aurora.Places {
		if place.Place == knownPlace {
			fmt.Fprint(w, aurora.GetSavedAuroraOdds(place.Place))
			return
		}
	}

	fmt.Fprint(w, "Not a tracked place")
}

func GetCurrentAuroraOdds(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	lat, _ := strconv.ParseFloat(r.URL.Query().Get("latitude"), 32)
	long, _ := strconv.ParseFloat(r.URL.Query().Get("longitude"), 32)

	l := aurora.GetAuroraOdds()

	odds := aurora.GetLatLong(float32(lat), float32(long), l)

	fmt.Fprint(w, odds)
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
	router.GET("/getCurrentAuroraOdds", GetCurrentAuroraOdds)
	router.GET("/getKnownAuroraOdds", GetKnownAuroraOdds)
	router.GET("/getMap", GetMap)
	log.Fatal(http.ListenAndServe("localhost:42229", router))
}
