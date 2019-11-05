import React, { Component } from "react";
import Axios from "axios";
import ColumnResizer from "react-column-resizer";

export default class List extends Component {
  _isMounted = false; //Used to prevent memory leak 
  constructor(props) {
    super(props);
    this.state = {
      page_number: 1,
      page_limit: 20,
      list_data: [],
      error: [],
      loading: false,
      selectAll: false,
      page_height: window.innerHeight,
    };
  }
  componentDidMount() {
    this._isMounted = true;
    //Fetch data for the first time.
    this.fetchList();

    // Detect when scrolled to bottom.
    this.refs.myscroll.addEventListener("scroll", () => {
      // calculate if sections height surpass the scroll's height
      // if yes then it will fetch more data.
      if (
        this.refs.myscroll.scrollTop + this.refs.myscroll.clientHeight + 2 >=
        this.refs.myscroll.scrollHeight
      ) {
        this.fetchList()
      }
    });
    
    // Get dynamic height for referance myscroll.
    window.addEventListener("resize", (e) => {
      this.setState({
        page_height: e.target.innerHeight
      })
    });
  }

  // Consuming Api using Axios's get function
  fetchList = () => {
    let {
      page_number,
      page_limit,
      loading
    } = this.state;
    // if data still loading then it will prevent additional api call's
    if (!loading && this._isMounted) {
      this.setState(
        prevState => {
          return {
            loading: true,
            selectAll: false,
            page_number: prevState.page_number + 1
          };
        },
        async () => {
          await Axios.get(
              `https://jsonplaceholder.typicode.com/photos?_page=${page_number}&_limit=${page_limit}`
            )
            .then(res => {
              // it will create an additional key pair named isChecked for smooth checkbox usage.
              let data = res.data.map(el => {
                var o = Object.assign({}, el);
                o.isChecked = false;
                return o;
              });
              // then data will be appended with previous data. 
              this.setState(prevState => {
                return {
                  list_data: prevState.list_data.concat(data),
                  loading: false
                };
              });
            })
            .catch(error => this.setState({
              error: error
            }));
        }
      );
    }
  };

  // Handle individual checkbox or all available checkbox.
  handleCheckboxChange = e => {
    const name = e.target.name;
    const isCheck = e.target.checked;
    if (name === "all") {
      this.setState(prevState => {
        return {
          selectAll: prevState.selectAll ? false : true,
          list_data: this.state.list_data.map(item => ({
            ...item,
            isChecked: isCheck
          }))
        };
      });
    } else {
      this.setState({
        list_data: this.state.list_data.map(item =>
          item.id.toString() === name ? {
            ...item,
            isChecked: isCheck
          } : item
        )
      });
    }
  };

  //When user click on row this function will execute
  handleRowSelect = (id) => {
    this.setState({
      list_data: this.state.list_data.map(item =>
        item.id === id ? {
          ...item,
          isChecked: !item.isChecked
        } : item
      )
    });
  }

  //isMounted will be false when component will unmount to prevent memory leak for setState.
  componentWillUnmount() {
    this._isMounted = false;
  }
  
  render() {
    let { list_data, loading, selectAll, page_height, error } = this.state;
    // creating a row from fetched data.
    let items = list_data
      ? list_data.map(record => {
          return (
            <tr key={record.id} onClick={() => this.handleRowSelect(record.id)} className="pointer">
              <td>
                <input
                  type="checkbox"
                  name={record.id}
                  checked={record.isChecked}
                  onChange={e => this.handleCheckboxChange(e)}
                />
              </td>
              <td className="text-right">{record.id}</td>
              <td colSpan="2">
                <div className="img-table-align">
                  <img
                    src={record.thumbnailUrl}
                    alt={record.thumbnailUrl}
                    width="50"
                    className="thumb-img"
                  />
                    &nbsp; <span className="align-cell">{record.title}</span>
                </div>
              </td>
              <td><a href={`${record.url}.jpg`} target="_blank" rel="noopener noreferrer" download>View Art</a></td>
              <td className="text-right">{record.albumId}</td>
            </tr>
          );
        })
      : "";
      
    return (
      <div ref="myscroll" style={{ height: `${page_height-75}px`, width: "100%", overflow: "auto", marginTop: "15px" }}>
        {error ?  <div>{error}</div> : ''}
        <table className="listTable">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  name="all"
                  checked={selectAll}
                  onChange={e => this.handleCheckboxChange(e)}
                />
              </th>
              <th>Id</th>
              <th>Album Title</th>
              <ColumnResizer className="columnResizer" />
                <th>Album Cover</th>
              <th>Album Id</th>
            </tr>
          </thead>
          <tbody>{items}</tbody>
        </table>
        {loading ? 
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div> : ""}
      </div>
    );
  }
}
