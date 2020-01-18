import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, ListSubheader, ListItemSecondaryAction, Chip, Button, Snackbar } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { AddCircle, RemoveCircle, Close } from '@material-ui/icons';
import { FirebaseService } from '../../services/Firebase.service';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});

class Consumer extends Component {

    firebase = new FirebaseService();
    state = { categories: [], products: [], order: {}, selected: null, orderSuccess: false }

    componentDidMount() {
        this.firebase.getMenu(this.props.match.params.venue).then(products => this.setState({
            products,
            categories: products.map(p => p.category).filter((c, ix, arr) => arr.indexOf(c) === ix)
        }));
    }

    addToOrder(product, q) {
        const crt = this.state.order[product];
        const order = this.state.order;
        if (!crt && q === 1) {
            order[product] = 1;
        }
        if (crt + q === 0) {
            delete order[product];
        }
        if (crt && crt + q > 0) {
            order[product] = crt + q;
        }
        this.setState({ order })
    }

    sendOrder() {
        this.firebase.placeOrder(this.props.match.params.venue, this.props.match.params.table, this.state.order)
            .then(() => this.setState({ orderSuccess: true, order: {} }))
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.state.categories.map(c =>
                    <List key={c} component="nav" aria-labelledby={`${c}`}
                        subheader={
                            <ListSubheader component="div">{c}</ListSubheader>
                        }
                    >
                        {
                            this.state.products.filter(p => p.category === c).map(p =>
                                <ListItem
                                    selected={this.state.selected === p.id}
                                    key={p.id}
                                    button
                                    onClick={() => this.setState({ selected: p.id })}
                                >
                                    <ListItemText primary={p.name} />
                                    {this.state.selected === p.id &&
                                        <ListItemSecondaryAction style={{ marginRight: '40px' }}>
                                            <IconButton
                                                onClick={() => this.addToOrder(p.id, 1)}
                                                edge="end"
                                                aria-label="add">
                                                <AddCircle />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => this.addToOrder(p.id, -1)}
                                                edge="end"
                                                aria-label="remove">
                                                <RemoveCircle />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    }
                                    {this.state.order[p.id] &&
                                        <ListItemSecondaryAction>
                                            <Chip color="primary" label={this.state.order[p.id]} />
                                        </ListItemSecondaryAction>
                                    }
                                </ListItem>
                            )
                        }
                    </List>
                )}
                <Button color="primary" onClick={() => this.sendOrder()}>Send order</Button>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.orderSuccess}
                    autoHideDuration={5000}
                    onClose={() => this.setState({ orderSuccess: false })}
                    message="Order sent!"
                    action={
                        <Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={() => this.setState({ orderSuccess: false })}>
                                <Close />
                            </IconButton>
                        </Fragment>
                    }
                />
            </div>
        );
    }
}

export default withStyles(styles)(Consumer);