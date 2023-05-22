import React, { useEffect, useState, createContext, useContext } from "react";
import {
  BottomNavigation,
  Appbar,
  TextInput,
  Button,
  Card,
  Avatar,
  IconButton,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

const ApiKeyContext = createContext();

const AppBarComponent = ({ title }) => {
  const apiKeyContext = useContext(ApiKeyContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);

  const LogOut = () => {
    apiKeyContext.setApiKey("");
    openSecondModal();
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openSecondModal = () => {
    setSecondModalVisible(true);
  };

  const closeSecondModal = () => {
    setSecondModalVisible(false);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={title} />
        <Appbar.Action icon="account" onPress={openModal} />
      </Appbar.Header>

      <Modal
        visible={modalVisible}
        onRequestClose={closeModal}
        style={{
          zIndex: 9999,
          backgroundColor: "#fff",
          borderRadius: 15,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.17,
          shadowRadius: 3.05,
          elevation: 4,
          padding: 25,
        }}
      >
        <Text
          style={{
            width: "95%",
            marginVertical: 12,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Your API Key
        </Text>
        <View style={{borderColor: '#919191', borderWidth: 1, borderStyle: 'solid', borderRadius: 12, padding: 15}}>
          <Text>{apiKeyContext.apiKey}</Text>
        </View>
        <TouchableOpacity
          style={{
            width: "100%",
            borderRadius: 12,
            backgroundColor: "#0d6efd",
            padding: 15,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginVertical: 10,
          }}
          onPress={closeModal}
        >
          <Text style={{ color: "#fff" }}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "100%",
            borderRadius: 12,
            padding: 15,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginVertical: 10,
          }}
          onPress={LogOut}
        >
          <Text style={{ color: "#0d6efd" }}>Log out</Text>
        </TouchableOpacity>
      </Modal>

      <MyModal isVisible={secondModalVisible} closeModal={closeSecondModal} />
    </>
  );
};

const MyModal = ({ isVisible, closeModal }) => {
  const [apiKey, setApiKey] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("login");
  const apiKeyContext = useContext(ApiKeyContext);

  const checkKey = async (key) => {
    try {
      const response = await fetch(
        "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=" +
          key
      );
      const result = await response.json();
      if (result.error && result.error.code === "API_KEY_INVALID") {
        alert("NASA API Key Incorrect");
      } else if (result.error && result.error.code === "API_KEY_MISSING") {
        alert("NASA API Key Missing");
      } else {
        apiKeyContext.setApiKey(key); // Save the valid API key in the context
        closeModal(); // Close the modal when the API key is valid
      }
    } catch (error) {
      alert("Error validating API key");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderTabItem = (tab, label) => {
    const isActive = activeTab === tab;

    return (
      <TouchableOpacity
        style={[
          styles.tabItem,
          isActive && styles.activeTabItem,
          Platform.OS === "ios" && styles.iosTabItem,
        ]}
        onPress={() => handleTabChange(tab)}
      >
        <Text
          style={[
            styles.tabItemText,
            isActive && styles.activeTabItemText,
            Platform.OS === "ios" && styles.iosTabItemText,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal isVisible={isVisible} onRequestClose={closeModal}>
       <View style={styles.modalContainer}>
        <View style={styles.tabContainer}>
          {renderTabItem("login", "Log In")}
          {renderTabItem("signup", "Sign Up")}
        </View>
        {activeTab === "login" ? (
          <View style={{ flex: 1, width: "95%" }}>
            <Text style={{ fontSize: 30, fontWeight: "700", marginTop: 15 }}>
              Log in by your token
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                opacity: 0.7,
                marginTop: 15,
              }}
            >
              Enter your API code
            </Text>
            <TextInput
              label="API Code"
              mode="outlined"
              value={apiKey}
              style={{ width: "100%", marginTop: 10 }}
              onChangeText={setApiKey}
            />
            <Button
              mode="contained"
              contentStyle={{ width: "100%", height: 50 }}
              style={{
                marginTop: 10,
                borderRadius: 12,
                backgroundColor: "#0d6efd",
              }}
              onPress={() => {
                checkKey(apiKey);
              }}
            >
              Log In
            </Button>
          </View>
        ) : (
          <View style={{ flex: 1, width: "100%" }}>
            <WebView
              source={{ uri: "https://api.nasa.gov/#signUp" }}
              style={{ flex: 1 }}
              injectedJavaScript={`
                var element = document.getElementById('underHeader');
                var element1 = document.getElementById('myHeader');
                var element2 = document.getElementById('authentication');
                var element3 = document.getElementById('recovery');
                var element4 = document.getElementById('browseAPI');
                var elementsToRemove = document.querySelectorAll('.usa-banner');
                var elementsToRemove1 = document.querySelectorAll('.usa-hero');
                var elementsToRemove2 = document.querySelectorAll('.oit-footer');
                element.remove();
                element1.remove();
                element2.remove();
                element3.remove();
                element4.remove();
                elementsToRemove.forEach(function(element) {
                  element.parentNode.removeChild(element);
                });
                elementsToRemove1.forEach(function(element) {
                  element.parentNode.removeChild(element);
                });
                elementsToRemove2.forEach(function(element) {
                  element.parentNode.removeChild(element);
                });
            `}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};


const APODRoute = () => {
  const [img, setImg] = useState();
  const today = new Date();
  today.setDate(today.getDate() - 1); // Subtract one day
  const [date, setDate] = useState(today);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState("");
  const apiKeyContext = useContext(ApiKeyContext);

  const fetchAPODPhotos = async (selectedDate) => {
    try {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      const response = await fetch(
        "https://api.nasa.gov/planetary/apod?date=" +
          formattedDate +
          "&api_key=" +
          apiKeyContext.apiKey
      );
      const data = await response.json();
      setTitle(data.title);
      setExplanation(data.explanation);
      setImg(data.hdurl);
    } catch (error) {
      console.error("Error fetching APOD photos:", error);
    }
  };

  useEffect(() => {
    fetchAPODPhotos(date);
  }, [apiKeyContext.apiKey]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() - 1);

    if (selectedDate >= maxDate) {
      setDate(maxDate);
      alert("Error with date");
    } else {
      setDate(currentDate);
    }

    setOpen(false);
    fetchAPODPhotos(currentDate);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          backgroundColor: "#fffbfe",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            width: "95%",
            marginVertical: 12,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Change Data
        </Text>
        <TouchableOpacity
          style={{
            width: "95%",
            borderRadius: 12,
            backgroundColor: "#0d6efd",
            padding: 15,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={() => setOpen(true)}
        >
          <Avatar.Icon size={24} icon="calendar-today" />
          <Text style={{ color: "#fff", marginLeft: 10 }}>
            {date.toDateString()}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginBottom: 50,
        }}
      >
        <Text
          style={{
            width: "95%",
            marginVertical: 12,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Info
        </Text>
        <Card style={{ width: "95%" }} mode="outlined">
          {open && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <Card.Cover source={{ uri: img }} style={{ height: 300 }} />
          <Card.Content>
            <Text style={{ marginVertical: 10, fontWeight: 700, fontSize: 16 }}>
              {title}
            </Text>
            <Text>{explanation}</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const AsteroidsRoute = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const startDate = new Date();
  const endDate = new Date();
  startDate.setDate(endDate.getDate() - 8);
  endDate.setDate(endDate.getDate() - 1);
  const [date1, setDate1] = useState(startDate);
  const [date2, setDate2] = useState(endDate);
  const [objectCount, setObjectCount] = useState(null);
  const [asteroids, setAsteroids] = useState([]); // State variable to store the asteroids
  const apiKeyContext = useContext(ApiKeyContext);

  const fetchAsteroidsPhotos = async (selectedDate1, selectedDate2) => {
    try {
      const formattedDate1 = moment(selectedDate1).format("YYYY-MM-DD");
      const formattedDate2 = moment(selectedDate2).format("YYYY-MM-DD");

      const response = await fetch(
        "https://api.nasa.gov/neo/rest/v1/feed?start_date=" +
          formattedDate1 +
          "&end_date=" +
          formattedDate2 +
          "&api_key=" +
          apiKeyContext.apiKey
      );
      const data = await response.json();

      if (data.near_earth_objects) {
        setObjectCount(data.element_count);
        const asteroidList = [];

        Object.keys(data.near_earth_objects).forEach((date) => {
          asteroidList.push(...data.near_earth_objects[date]);
        });

        setAsteroids(asteroidList);
      }
    } catch (error) {
      console.error("Error fetching Asteroid Info:", error);
    }
  };

  useEffect(() => {
    fetchAsteroidsPhotos(date1, date2);
  }, [apiKeyContext.apiKey]);

  const handleDateChange1 = (event, selectedDate) => {
    const currentDate = selectedDate || date1;
    if (currentDate >= date2) {
      setDate1(startDate);
      setDate2(endDate);
      console.log("Error: First date cannot be greater than the second date");
    } else if (currentDate > new Date()) {
      setDate1(startDate);
      selectedDate(endDate);
      console.log("Error: First date cannot be in the future");
    } else {
      setDate1(currentDate);
    }
    setOpen1(false);
    fetchAsteroidsPhotos(currentDate, date2);
  };

  const handleDateChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || date2;
    setDate2(currentDate);
    fetchAsteroidsPhotos(date1, currentDate);
    setOpen2(false);
  };

  const renderAsteroidItem = ({ item }) => (
    <Card style={{ marginVertical: 5 }}>
      <Card.Title title={item.name} />
      <Card.Content>
        <Text>ID: {item.id}</Text>
        <Text>Absolute Magnitude: {item.absolute_magnitude_h}</Text>
        <Text>
          Estimated Diameter:{" "}
          {item.estimated_diameter.kilometers.estimated_diameter_min} -{" "}
          {item.estimated_diameter.kilometers.estimated_diameter_max}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          width: "95%",
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            borderRadius: 12,
            backgroundColor: "#0d6efd",
            padding: 15,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginRight: 5,
          }}
          onPress={() => setOpen1(true)}
        >
          <Avatar.Icon size={24} icon="calendar-today" />
          <Text style={{ color: "#fff", marginLeft: 10 }}>
            {" "}
            {date1.toDateString()}{" "}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            borderRadius: 12,
            backgroundColor: "#0d6efd",
            padding: 15,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginLeft: 5,
          }}
          onPress={() => setOpen2(true)}
        >
          <Avatar.Icon size={24} icon="calendar-today" />
          <Text style={{ color: "#fff", marginLeft: 10 }}>
            {" "}
            {date2.toDateString()}{" "}
          </Text>
        </TouchableOpacity>
      </View>
      {open1 && (
        <DateTimePicker
          value={date1}
          mode="date"
          display="default"
          onChange={handleDateChange1}
        />
      )}
      {open2 && (
        <DateTimePicker
          value={date2}
          mode="date"
          display="default"
          onChange={handleDateChange2}
        />
      )}
      <Text
        style={{
          width: "95%",
          marginVertical: 12,
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        Near Earth Objects
      </Text>
      <Text
        style={{
          width: "95%",
          opacity: 0.7,
          marginVertical: 3,
          fontWeight: 500,
          fontSize: 14,
        }}
      >
        Object Count: {objectCount}
      </Text>
      <FlatList
        data={asteroids}
        renderItem={renderAsteroidItem}
        keyExtractor={(item) => item.id}
        style={{ width: "95%" }}
      />
    </View>
  );
};

const EarthRoute = () => {
  const apiKeyContext = useContext(ApiKeyContext);
  const today = new Date();
  today.setDate(today.getDate() - 650);
  const [date, setDate] = useState(today);
  const [lon, setLon] = useState("100.75");
  const [lat, setLat] = useState("1.5");
  const [dim, setDim] = useState("0.15");
  const [id, setId] = useState();
  const [open, setOpen] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const fetchEarthPhotos = async (lon, lat, date, dim) => {
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const response = await fetch(
        "https://api.nasa.gov/planetary/earth/assets?lon=" +
          lon +
          "&lat=" +
          lat +
          "&date=" +
          formattedDate +
          "&dim=" +
          dim +
          "&api_key=" +
          apiKeyContext.apiKey
      );
      const data = await response.json();
      setImageURL(data.url);
      setId(data.id);
      console.log(data);
    } catch (error) {
      console.error("Error fetching Asteroid Info:", error);
    }
  };

  useEffect(() => {
    fetchEarthPhotos(lon, lat, date, dim);
  }, [apiKeyContext.apiKey]);

  const handleLonChange = (value) => {
    setLon(value);
    fetchEarthPhotos(lon, lat, date, dim);
  };
  const handleLatChange = (value) => {
    setLat(value);
    fetchEarthPhotos(lon, lat, date, dim);
  };

  const handleDateChange = (event, selectedDate) =>{
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setOpen(false);
    fetchEarthPhotos(lon, lat, date, dim);
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          backgroundColor: "#fffbfe",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {open && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Text
          style={{
            width: "95%",
            marginVertical: 12,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Change Data
        </Text>
        <TouchableOpacity
          style={{
            width: "95%",
            borderRadius: 12,
            backgroundColor: "#0d6efd",
            padding: 15,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={() => {
            setOpen(true);
          }}
        >
          <Avatar.Icon size={24} icon="calendar-today" />
          <Text style={{ color: "#fff", marginLeft: 10 }}>
            {date.toDateString()}
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            width: "95%",
            marginVertical: 12,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Change Longitude
        </Text>
        <TextInput
          label="Longitude"
          mode="outlined"
          value={lon}
          style={{ width: "95%", marginTop: 10 }}
          onChangeText={(text) => handleLonChange(text)}
          keyboardType="numeric"
        />
        <Text
          style={{
            width: "95%",
            marginVertical: 12,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Change Latitude
        </Text>
        <TextInput
          label="Latitude"
          mode="outlined"
          value={lat}
          style={{ width: "95%", marginTop: 10 }}
          onChangeText={handleLatChange}
          keyboardType="numeric"
        />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginBottom: 50,
        }}
      >
        <Text
          style={{
            width: "95%",
            marginVertical: 12,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Info
        </Text>
        <Card style={{ width: "95%" }} mode="outlined">
          <Card.Cover source={{ uri: imageURL }} style={{ height: 300 }} />
          <Card.Content>
            <Text
              style={{ marginVertical: 10, fontWeight: 700, fontSize: 16 }}
            ></Text>
            <Text>{id}</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const MarsRoute = () => {
  const [imgs, setImgs] = useState([]);
  const apiKeyContext = useContext(ApiKeyContext);

  useEffect(() => {
    const fetchMarsPhotos = async () => {
      try {
        const response = await fetch(
          `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${apiKeyContext.apiKey}`
        );
        const data = await response.json();
        const photos = data.photos;

        const imgSrcs = [];
        for (let i = 0; i < photos.length; i++) {
          const imgSrc = photos[i].img_src;
          imgSrcs.push(imgSrc);
        }
        setImgs(imgSrcs);
      } catch (error) {
        console.error("Error fetching Mars photos:", error);
      }
    };

    fetchMarsPhotos();
  }, [apiKeyContext.apiKey]);

  const renderImageItem = ({ item }) => (
    <View style={{ width: "50%", height: 160, padding: 5 }}>
      <Image source={{ uri: item }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={imgs}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </View>
  );
};

const EpicRoute = () => {
  const [imgs, setImgs] = useState([]);
  const apiKeyContext = useContext(ApiKeyContext);

  useEffect(() => {
    const fetchEpicPhotos = async () => {
      try {
        const response = await fetch(
          `https://api.nasa.gov/EPIC/api/natural/images?api_key=${apiKeyContext.apiKey}`
        );
        const data = await response.json();
        const imgCodes = [];
        const dates = [];
        const imgsIter = [];
        for (let i = 0; i < data.length; i++) {
          const imgCodeIter = data[i].image;
          const dateTime = data[i].date;
          const [datePart, timePart] = dateTime.split(" ");
          const [year, month, day] = datePart.split("-");
          const formattedDate = `${year}/${month}/${day}`;
          dates.push(formattedDate);
          imgCodes.push(imgCodeIter);
          imgsIter.push('https://api.nasa.gov/EPIC/archive/natural/' + formattedDate +'/png/' + imgCodeIter + '.png?api_key=' + apiKeyContext.apiKey);
        }
        setImgs(imgsIter);
      } catch (error) {
        console.error("Error fetching Mars photos:", error);
      }
    };

    fetchEpicPhotos();
  }, [apiKeyContext.apiKey]);

  const renderImageItem = ({ item }) => (
    <View style={{ width: "50%", height: 160, padding: 5 }}>
      <Image source={{ uri: item }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={imgs}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </View>
  );
};

const MyComponent = () => {
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState("APOD");

  const [isModalVisible, setModalVisible] = useState(true);
  const [apiKey, setApiKey] = useState(null);

  const closeModal = () => {
    setModalVisible(false);
  };

  const apiKeyValue = { apiKey, setApiKey }; // Create the API key context value

  const routes = [
    { key: "apod", title: "APOD", focusedIcon: "atom" },
    { key: "asteroids", title: "Asteroids", focusedIcon: "meteor" },
    { key: "earth", title: "Earth", focusedIcon: "earth" },
    { key: "mars", title: "Mars", focusedIcon: "google-earth" },
    { key: "epic", title: "EPIC", focusedIcon: "space-station" },
  ];

  const renderScene = BottomNavigation.SceneMap({
    apod: APODRoute,
    asteroids: AsteroidsRoute,
    earth: EarthRoute,
    mars: MarsRoute,
    epic: EpicRoute,
  });

  const handleIndexChange = (newIndex) => {
    setIndex(newIndex);
    setTitle(routes[newIndex].title);
  };

  return (
    <SafeAreaProvider>
      <ApiKeyContext.Provider value={apiKeyValue}>
        <MyModal isVisible={isModalVisible} closeModal={closeModal} />
        <AppBarComponent title={title} />
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={handleIndexChange}
          renderScene={renderScene}
        />
      </ApiKeyContext.Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabItem: {
    borderBottomColor: "#007AFF",
  },
  iosTabItem: {
    borderBottomColor: "transparent",
  },
  tabItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
  },
  activeTabItemText: {
    color: "#007AFF",
  },
  iosTabItemText: {
    color: "#007AFF",
  },
});

export default MyComponent;
