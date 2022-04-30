import React, { useContext, useEffect, useState } from "react";
import { Markdown } from "components/ui/Markdown";

import chat from "assets/icons/expression_chat.png";
import question from "assets/icons/expression_confused.png";
import confirm from "assets/icons/confirm.png";
import arrowRight from "assets/icons/arrow_right.png";
import close from "assets/icons/close.png";

import { Panel, OuterPanel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { AnnouncementContext } from "../AnnouncementQueueProvider";

interface Props {
  isLoading: boolean;
  onClose: () => void;
}

type Tab = "announcements" | "whats-new";

const TAB_CONTENT_HEIGHT = 384;

const renderMarkdownComponent = (
  markdownContent: string,
  listIcon: any = null
) => {
  // The 'components' prob below is how we tell the markdown to render in HTML (with styles)
  return (
    <Markdown
      className="sm:text-sm py-2 px-3"
      components={{
        h1: "h2",
        h2: ({ children }) => <h2 className="underline">{children}</h2>,
        h3: "h2",
        li: ({ children }) => (
          <li className="text-sm pt-2.5 pl-3">
            {listIcon && (
              <img src={listIcon} className="inline-block pr-2 pb-1.5" />
            )}
            {children}
          </li>
        ),
        p: ({ children }) => <p className="text-sm pt-2">{children}</p>,
      }}
    >
      {markdownContent}
    </Markdown>
  );
};

export const AnnouncementItems: React.FC<Props> = ({ isLoading, onClose }) => {
  const [currentTab, setCurrentTab] = useState<Tab>("announcements");
  const { announcementList } = useContext(AnnouncementContext);

  const handleTabClick = (tab: Tab) => {
    setCurrentTab(tab);
  };

  const whatsNewAnnouncement = announcementList.find(
    (a) => a.type === "whats-new"
  );

  const generalAnnouncements = announcementList.filter(
    (a) => a.type === "general"
  );

  // Fix case where there are no 'general' announcements, but indeed are 'whats-new' announcements
  useEffect(() => {
    if (generalAnnouncements.length === 0) {
      setCurrentTab("whats-new");
    }
  }, [generalAnnouncements]);

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          {generalAnnouncements.length > 0 && (
            <Tab
              className="flex items-center"
              isActive={currentTab === "announcements"}
              onClick={() => handleTabClick("announcements")}
            >
              <img src={chat} className="h-4 sm:h-5 mr-2" />
              <span className="text-xs sm:text-sm overflow-hidden text-ellipsis">
                Announcements
              </span>
            </Tab>
          )}
          {whatsNewAnnouncement && (
            <Tab
              className="flex items-center"
              isActive={currentTab === "whats-new"}
              onClick={() => handleTabClick("whats-new")}
            >
              <img src={question} className="h-4 sm:h-5 mr-2" />
              <span className="text-xs sm:text-sm overflow-hidden text-ellipsis">
                What&apos;s&nbsp;New
              </span>
            </Tab>
          )}
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>

      <div
        style={{ maxHeight: TAB_CONTENT_HEIGHT }}
        className="overflow-y-auto scrollable"
      >
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            {currentTab === "announcements" &&
              generalAnnouncements &&
              generalAnnouncements.map((ga, index) => (
                <OuterPanel key={index} className="py-2 m-1">
                  {renderMarkdownComponent(ga.content, arrowRight)}
                </OuterPanel>
              ))}

            {currentTab === "whats-new" && whatsNewAnnouncement && (
              <>
                <OuterPanel className="p-2 m-1 inline-block">
                  <h1>
                    <a
                      className="underline text-sm"
                      href="https://github.com/sunflower-land/sunflower-land/releases"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {announcementList && announcementList[0].title}
                    </a>
                  </h1>
                </OuterPanel>

                <OuterPanel className="p-1 m-1">
                  {renderMarkdownComponent(
                    whatsNewAnnouncement.content,
                    confirm
                  )}
                </OuterPanel>
              </>
            )}
          </>
        )}
      </div>
    </Panel>
  );
};
