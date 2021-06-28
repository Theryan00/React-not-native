import React, { Component, useEffect, useState } from "react";
import { ordersDb, menuItemsDb, consumersDb } from "../../firebase/firebase";

import Dashboard from "./Dashboard";

const DashboardController = () => {
  const [orders, setOrders] = useState(0);
  const [nrOfOrder, setNrOfOrder] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [consumers, setConsumers] = useState([]);
  var sum = 0;
  var count = 0;
  useEffect(() => {
    menuItemsDb.on("value", function (snap) {
      var menuItem = [];

      snap.forEach(function (item) {
        menuItem.push({ ...item.val(), key: item.key });
      });
      setMenuItems(menuItem);
    });
    consumersDb.on("value", function (snap) {
      var consumerList = [];
      snap.forEach(function (item) {
        consumerList.push(item.val());
      });
      setConsumers(consumerList);
    });
    ordersDb.on("value", (snap) => {
      sum = 0;
      count = 0;
      var orderList = [];

      snap.forEach(function (childSnap) {
        count++;
        sum += childSnap.val().totalPrice;
        orderList.push(childSnap.val());
      });
      setOrders(sum);
      setNrOfOrder(count);
      setOrdersList(orderList);
    });
  }, []);

  return (
    <Dashboard
      orders={orders}
      nrOfOrder={nrOfOrder}
      menuItems={menuItems}
      orderList={ordersList}
      consumerList={consumers}
    />
  );
};

export default DashboardController;
