package aurora

import (
	"encoding/json"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type AuroraOdds struct {
	Time      time.Time
	Place     string
	Latitude  float32
	Longitude float32
	Odds      int
}

type MapLatitude struct {
	Latitude float32
	Auroras  []AuroraOdds
}

type Map struct {
	Latitudes []MapLatitude
}

var Places []AuroraOdds = []AuroraOdds{
	{
		Place:     "Sioux City",
		Latitude:  42.499994,
		Longitude: -96.400307,
	},
	{
		Place:     "Omaha",
		Latitude:  41.252363,
		Longitude: -95.997988,
	},
	{
		Place:     "Lincoln",
		Latitude:  40.825763,
		Longitude: -96.685198,
	},
	{
		Place:     "Fargo",
		Latitude:  46.877186,
		Longitude: -96.789803,
	},
	{
		Place:     "South Greenland",
		Latitude:  69.564935,
		Longitude: 23.129993,
	},
	{
		Place:     "Fairbanks",
		Latitude:  64.884606,
		Longitude: -147.66287,
	},
}

type Latitude []int

type Odds struct {
	Latitudes []Latitude
}

func CreateMap() string {
	m := Map{[]MapLatitude{}}
	odds := GetAuroraOdds()
	for i := 49; i > 40; i-- {
		ao := []AuroraOdds{}
		for j := -140; j < -69; j += 10 {
			o := AuroraOdds{Latitude: float32(i), Longitude: float32(j),
				Odds: GetLatLong(float32(i), float32(j), odds)}

			ao = append(ao, o)
		}
		ml := MapLatitude{float32(i), ao}
		m.Latitudes = append(m.Latitudes, ml)
	}

	s, _ := json.Marshal(m)
	return string(s)
}

func GetAuroraOdds() Odds {
	latestFile, err := http.DefaultClient.Get("http://services.swpc.noaa.gov/text/aurora-nowcast-map.txt")
	if err != nil {
		log.Fatal(err)
	}

	bytes, err := ioutil.ReadAll(latestFile.Body)

	if err != nil {
		log.Fatal(err)
	}

	sFile := string(bytes)

	lines := strings.Split(sFile, "\n")

	odds := Odds{Latitudes: []Latitude{}}

	for _, line := range lines {
		if strings.Contains(line, "#") {
			continue
		}

		line = strings.Replace(line, "   ", "\t", -1)
		line = strings.Replace(line, "  ", "\t", -1)
		line = strings.Replace(line, " ", "\t", -1)

		strs := strings.Split(line, "\t")
		ints := []int{}

		for _, readOdds := range strs {
			if readOdds == "" {
				continue
			}
			val, err := strconv.ParseInt(readOdds, 10, 32)

			if val > 10 {
				log.Println("Odds")
			}

			if err != nil {
				log.Println("Parser is wrong")
			}
			ints = append(ints, int(val))

		}

		odds.Latitudes = append(odds.Latitudes, ints)
	}

	return odds
}

func TrackPlaces() {
	ticker := time.NewTicker(15 * time.Minute)

	go func() {
		for {
			select {
			case <-ticker.C:
				for _, place := range Places {
					odds := GetAuroraOdds()
					val := GetLatLong(place.Latitude, place.Longitude, odds)
					SaveAuroraOdds(place.Place, place.Latitude, place.Longitude, val)
				}
			}
		}
	}()
}

func SaveAuroraOdds(place string, lat float32, long float32, odds int) {
	session, err := mgo.Dial("localhost")
	if err != nil {
		log.Println(err)
		return
	}
	defer session.Close()

	auroraOdds := AuroraOdds{time.Now(), place, lat, long, odds}

	c := session.DB("travel-planner").C("aurora")
	q := bson.M{"place": auroraOdds.Place, "time": auroraOdds.Time}
	_, err = c.Upsert(q, &auroraOdds)
	err = c.Find(bson.M{"place": auroraOdds.Place, "time": auroraOdds.Time}).One(&auroraOdds)

	if err != nil {
		log.Println(err)
	}
}

func GetSavedAuroraOdds(place string) string {
	session, err := mgo.Dial("localhost")
	if err != nil {
		log.Println(err)
		return "Error connection to database"
	}
	defer session.Close()

	for _, auroraPlace := range Places {
		if place == auroraPlace.Place {
			knownOdds := []AuroraOdds{}

			c := session.DB("travel-planner").C("aurora")
			err = c.Find(bson.M{"place": place}).All(&knownOdds)

			if err != nil {
				log.Println(err)
			}

			oddsBytes, _ := json.Marshal(knownOdds)
			return string(oddsBytes)
		}

	}
	return ""
}

func GetLatLong(lat float32, long float32, odds Odds) int {
	for i, latitude := range odds.Latitudes {
		if float32(i)*0.3515625 >= float32(lat+90) {
			return getLong(long, latitude)
		}
	}

	log.Println("Latitude out of bounds")

	return 0
}

func getLong(long float32, lat Latitude) int {
	for i, longitude := range lat {
		if float32(i)*0.32846715 >= float32(long+180) {
			return longitude
		}
	}

	log.Println("Longitude out of bounds")

	return 0
}
