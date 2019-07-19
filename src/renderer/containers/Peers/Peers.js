import React from "react";
import PropTypes from 'prop-types';
import { Button, Divider, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {ipcRenderer} from 'electron';
import RefreshIcon from '@material-ui/icons/Refresh';

import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headRows = [
    { id: 'addr', numeric: false, disablePadding: false, label: 'Address' },
    { id: 'user_agent', numeric: false, disablePadding: false, label: 'User Agent' },
    { id: 'direction', numeric: true, disablePadding: false, label: 'Direction' },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headRows.map(row => (
                    <TableCell
                        key={row.id}
                        align={row.numeric ? 'right' : 'left'}
                        padding={row.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === row.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === row.id}
                            direction={order}
                            onClick={createSortHandler(row.id)}
                        >
                            {row.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
}));

const styles = theme => ({
  fullWidth: {
    width: '100%',
  },
  root: {
    flexGrow: 1,
  },
  actionIcon: {
    padding: 2 * theme.spacing.unit,
    textAlign: 'center'
  },
  send: {
    padding: theme.spacing.unit,
    textAlign: 'left',
  },
  receive: {
    padding: theme.spacing.unit,
    textAlign: 'right',
  }
});

function Peers(props) {
    const [refreshPeers, setRefreshPeers] = React.useState(false);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [dense, setDense] = React.useState(false);


    const EnhancedTableToolbar = props => {
        const classes = useToolbarStyles();
        const { numSelected } = props;

        return (
            <Toolbar className={classes.root}>
                <div className={classes.title}>
                    <Typography variant="h5" id="tableTitle">
                        Connected Peers
                    <IconButton onClick={function () { setRefreshPeers(!refreshPeers) }}>
                            <RefreshIcon />
                        </IconButton>
                    </Typography>
                </div>
            </Toolbar>
        );
    };

    function handleRequestSort(event, property) {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    }

    function handleClick(event, name) {
    }

    const { classes } = props;

    var peers = ipcRenderer.sendSync('GetConnectedPeers').peers;

    return (
        <React.Fragment>
            <br />
            <Grid container spacing={1} style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }} className={classes.root}>
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <EnhancedTableToolbar />
                    <div className={classes.tableWrapper}>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={peers.length}
                            />
                            <TableBody>
                                {stableSort(peers, getSorting(order, orderBy))
                                    .map((row, index) => {
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={event => handleClick(event, row.name)}
                                                role='hover'
                                                tabIndex={-1}
                                                key={row.addr}
                                            >
                                                <TableCell component="th" id={labelId} scope="row" padding="none">
                                                    {row.addr}
                                                </TableCell>
                                                <TableCell>{row.user_agent}</TableCell>
                                                <TableCell align="right">{row.direction}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </div>
                </Grid>
                <Grid item xs={2} />
            </Grid>
        </React.Fragment>
    );
}

Peers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Peers);
