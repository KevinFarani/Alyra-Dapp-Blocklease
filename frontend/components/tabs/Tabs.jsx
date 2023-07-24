import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import OfferTab from "./OfferTab";

const ItemsTabs = (props) => {
  const [tabsActive, setTabsActive] = useState(1);
  const tabsHeadText = [
    {
      id: 1,
      text: "Bookings",
      icon: "offers",
    },
  ];

  return (
    <>
      <div className="scrollbar-custom mt-14 overflow-x-auto rounded-lg">
        {/* <!-- Tabs Nav --> */}
        <Tabs className="min-w-fit tabs">
          <TabList className="nav nav-tabs flex items-center">
            {/* <!-- Offers --> */}
            {tabsHeadText.map(({ id, text, icon }) => {
              return (
                <Tab className="nav-item bg-transparent" key={id}>
                  <button
                    className="nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active"
                    onClick={() => setTabsActive(id)}
                  >
                    <svg className="icon mr-1 h-5 w-5 fill-current">
                      <use xlinkHref={`/icons.svg#icon-${icon}`}></use>
                    </svg>
                    <span className="font-display text-base font-medium">
                      {text}
                    </span>
                  </button>
                </Tab>
              );
            })}
          </TabList>

          <TabPanel className="tab-content">
            <OfferTab bookings={props.bookings} />
          </TabPanel>
         
        </Tabs>
      </div>
    </>
  );
};

export default ItemsTabs;
