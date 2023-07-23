import { useState } from "react";
import TrendingContent from "./trending";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

const AggregratorMain = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleTabSelect = (index) => {
    setSelectedTabIndex(index);
  };

  return (
    <section className="pb-24">
      <div className="container">
        <Tabs
          className="scrollbar-custom "
          selectedIndex={selectedTabIndex}
          onSelect={handleTabSelect}
        >
          {/* Tab List */}
          <TabList className="nav nav-tabs mb-4 flex items-center space-x-1 sm:space-x-6">
            <Tab className="nav-item">
              <button
                className={`nav-link nav-link--style-4 relative flex items-center whitespace-nowrap py-1.5 px-4 font-display font-semibold text-jacarta-400 hover:text-jacarta-700 dark:text-jacarta-200 dark:hover:text-white ${
                  selectedTabIndex === 0 ? "active" : ""
                }`}
                onClick={() => handleTabSelect(0)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  className="mr-1 h-5 w-5 fill-orange"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M13 10h7l-9 13v-9H4l9-13z" />
                </svg>
                <span className="font-display text-base font-medium">
                  ERC-4907 NFTs
                </span>
              </button>
            </Tab>
            {/* End tab */}
          </TabList>
          {/* End TabList */}

          <TabPanel>
            <TrendingContent />
          </TabPanel>
          {/* End Trending content */}
        </Tabs>
      </div>
    </section>
  );
};

export default AggregratorMain;
