import React, {Component} from 'react';
import { StyleSheet, Text, SafeAreaView, Switch, FlatList} from 'react-native';

const piholeurl = "http://static_ip/admin/api.php?"
const apikey = ""

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      version: Number,
      domains: Number,
      dnsQueries: Number,
      adsBlocked: Number,
      status: String,
      isEnabled: Boolean
    }
  }

  UNSAFE_componentWillMount() {
    this.getVersion();
  }

  componentDidMount() {
    setInterval(() => {
      this.getSummary();
    }, 3000)
  }

  getVersion = () => {
    fetch(`${piholeurl}version`)
    .then((response) => response.json())
    .then((json) => {
      this.setState({
        version: json.version
      })
    })
    .catch((err) => console.log(err))
  }

  getSummary = () => {
    fetch(`${piholeurl}summaryRaw`)
    .then((response) => response.json())
    .then((json) => {
      this.setState({
        domains: json.domains_being_blocked,
        dnsQueries: dns_queries_today,
        adsBlocked: json.ads_blocked_today,
        status: json.status
      })
    })
    .catch((err) => console.log(err))
  }

  enable = () => {
    fetch(`${piholeurl}enable&auth=${apikey}`)
    .catch((err) => console.log(err))
  }

  disable = () => {
    fetch(`${piholeurl}disable&auth=${apikey}`)
    .catch((err) => console.log(err))
  }

  toggleSwitch = () => {
    if (this.state.isEnabled == false) {
      this.setState({isEnabled: true})
      this.disable()
    }
    else {
      this.setState({isEnabled: false})
      this.enable()
    }
  }

  render() {

    const DATA = [
      {
        index: 1,
        text: `Version: ${this.state.version}`
      },
      {
        index: 2,
        text: `Domains Being Blocked: ${this.state.domains}`
      },
      {
        index: 3,
        text: `DNS Queries Today: ${this.state.dnsQueries}`
      },
      {
        index: 4,
        text: `Ads Blocked Today: ${this.state.adsBlocked}`
      },
      {
        index: 5,
        text: `Status: ${this.state.status}`
      }
    ]

    const renderItem = ({ item }) => {
      <Item text={item.text} />
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text>Pi-Hole Statistics</Text>
        </View>

        <View style={styles.list}>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.index}
          />
        </View>

        <View style={styles.footer}>
          <Text>Toggle Blocking</Text>
         <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          onValueChange={this.toggleSwitch()}
          value={this.state.isEnabled}/>
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: .8,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  header: {
    flex: .1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    fontSize: 20
  },
  footer: {
    flex: .1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    fontSize: 20
  }
});
