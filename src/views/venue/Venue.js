import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, ListSubheader, ListItemSecondaryAction, Snackbar } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Close, Check } from '@material-ui/icons';
import { FirebaseService } from '../../services/Firebase.service';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});

class Venue extends Component {

    firebase = new FirebaseService();
    state = { products: [], tables: [], orders: [], selected: null, orderSuccess: false }

    componentDidMount() {
        const venue = this.props.match.params.venue;
        Promise.all([
            this.firebase.getMenu(venue),
            this.firebase.getTables(venue)
        ])
            .then(([products, tables]) => {
                this.setState({ products, tables });
                this.firebase.getOrdersSnapshot(
                    venue,
                    orders => this.setState({ orders })
                );
            });

    }

    getTime(order) {
        return new Date(order.timestamp.seconds * 1000).toLocaleString();
    }

    getTable(tableId) {
        const table = this.state.tables.find(t => t.id === tableId);
        if (table) {
            return table.name;
        }
        return '-';
    }

    getProduct(productId) {
        const product = this.state.products.find(t => t.id === productId);
        if (product) {
            return product.name;
        }
        return '-';
    }

    fillOrder(orderId) {
        this.firebase.fillOrder(this.props.match.params.venue, orderId)
            .then(() => this.setState({ orderSuccess: true }))
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <List component="nav" aria-labelledby="orders"
                    subheader={
                        <ListSubheader component="div">Orders</ListSubheader>
                    }
                >
                    {this.state.orders.map(p =>
                        <ListItem
                            selected={this.state.selected === p.id}
                            key={p.id}
                            button
                            onClick={() => this.setState({ selected: p.id })}
                        >
                            <ListItemText primary={this.getTime(p)} />
                            <ListItemText primary={this.getTable(p.table.id)} />
                            <ListItemText primary={p.order.map(o => `${o.quantity} ${this.getProduct(o.product.id)}`).join(',')} />
                            {this.state.selected === p.id &&
                                <ListItemSecondaryAction>
                                    <IconButton
                                        onClick={() => this.fillOrder(p.id)}
                                        edge="end"
                                        aria-label="fill">
                                        <Check />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            }
                        </ListItem>
                    )}
                </List>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.orderSuccess}
                    autoHideDuration={5000}
                    onClose={() => this.setState({ orderSuccess: false })}
                    message="Order dispatched!"
                    action={
                        <Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={() => this.setState({ orderSuccess: false })}>
                                <Close />
                            </IconButton>
                        </Fragment>
                    }
                />
            </div >
        );
    }
}

export default withStyles(styles)(Venue);