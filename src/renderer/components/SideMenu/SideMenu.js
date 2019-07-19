import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { Redirect, Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import ButtonAppNav from '../ButtonAppNav';

import { Drawer, Divider, IconButton, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import WalletIcon from '@material-ui/icons/AccountBalanceWallet';
import OutputsIcon from '@material-ui/icons/CallReceived';
import PeersIcon from '@material-ui/icons/PermIdentity';
import LogoutIcon from '@material-ui/icons/PowerSettingsNew';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#000000',
        border: '#ffffff 2px solid'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
});

function SideMenu(props) {
    const { classes } = props;
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    function logout() {
        ipcRenderer.send('Logout');
        setOpen(false);
    }

    function handleDrawerOpen() {
        setOpen(true);
    }

    function handleDrawerClose() {
        setOpen(false);
    }

    return (
        <React.Fragment>
            <ButtonAppNav onClickMenu={handleDrawerOpen} {...props} />
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <List>
                    <ListItem button key='hide' onClick={handleDrawerClose}>
                        <ListItemIcon>
                            <ChevronLeftIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText secondary='Collapse/Hide' />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button key='Wallet' onClick={handleDrawerClose} component={Link} to={{ pathname: '/wallet' }}>
                        <ListItemIcon>
                            <WalletIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText secondary='Wallet' />
                    </ListItem>

                    <ListItem button key='Outputs' onClick={handleDrawerClose} component={Link} to={{ pathname: '/outputs' }}>
                        <ListItemIcon>
                            <OutputsIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText secondary='Outputs' />
                    </ListItem>

                    <ListItem button key='Peers' onClick={handleDrawerClose} component={Link} to={{ pathname: '/peers' }}>
                        <ListItemIcon>
                            <PeersIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText secondary='Peers' />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button key='Logout' onClick={logout} component={Link} to={{ pathname: '/' }}>
                        <ListItemIcon>
                            <LogoutIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText secondary='Logout' />
                    </ListItem>
                </List>
            </Drawer>
        </React.Fragment>
    );
}

SideMenu.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SideMenu);
