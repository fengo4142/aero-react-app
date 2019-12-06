import React,{Component} from "react";

import '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'; 
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

class NotamsTable extends Component {

  handleOnSelect = (row, isSelect) => {
    this.props.notamSelect(row,isSelect,'s');
    //return true; // return true or dont return to approve current select action
  }
  
  handleOnSelectAll = (isSelect, rows) => {
    this.props.notamSelect(rows,isSelect,'a');
  }

  render() {
    const { SearchBar } = Search;
    const {notamData,tableHeader} = this.props;
    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      style: { backgroundColor: '#c8e6c9' },
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
    };
    const options = {
      // pageStartIndex: 0,
    };

    return (
      <div>
        <ToolkitProvider
          keyField="id"
          data={ notamData }
          columns={ tableHeader }
          search
        >
          {
            props => (
              <div>
                <SearchBar { ...props.searchProps } />
                <hr />
                <BootstrapTable 
                  striped
                  hover
                  keyField='id' 
                  data={ notamData } 
                  columns={ tableHeader }
                  selectRow={ selectRow }
                  pagination={ paginationFactory(options) }
                  style={{width:"auto"}}
                  { ...props.baseProps }
                  />
              </div>
            )
          }
        </ToolkitProvider>
      </div>
    );
  }
}
export default NotamsTable;
