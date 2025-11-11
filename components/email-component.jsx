"use client";

import React, { memo } from "react";
import { TextBlock } from "./email-components/TextBlock";
import { Heading } from "./email-components/Heading";
import { ImageComponent } from "./email-components/Image";
import { ButtonComponent } from "./email-components/Button";
import { Divider } from "./email-components/Divider";
import { Spacer } from "./email-components/Spacer";
import { SocialMedia } from "./email-components/SocialMedia";
import { TwoColumn } from "./email-components/layouts/TwoColumn";
import { ThreeColumn } from "./email-components/layouts/ThreeColumn";
import { Link } from "./email-components/Link";
import { List } from "./email-components/List";

export const componentMap = {
  "text-block": TextBlock,
  heading: Heading,
  image: ImageComponent,
  button: ButtonComponent,
  divider: Divider,
  spacer: Spacer,
  "social-media": SocialMedia,
  "two-column": TwoColumn,
  "three-column": ThreeColumn,
  link: Link,
  list: List,
};

export const EmailComponent = memo(function EmailComponent({
  id,
  type,
  data,
  onUpdate,
  selectedComponentId,
  setSelectedComponentId,
  onSettingsClick, // For footer component
}) {
  const ComponentRenderer = componentMap[type];

  if (!ComponentRenderer) {
    return (
      <div className="border border-red-200 bg-red-50 text-red-700 rounded p-2">
        Unknown component type: {type}
      </div>
    );
  }

  return (
    <ComponentRenderer
      selectedComponentId={selectedComponentId}
      isSelected={id == selectedComponentId}
      setSelectedComponentId={setSelectedComponentId}
      data={data}
      onUpdate={onUpdate}
      useUnifiedToolbar={true} // Disable individual editing panels
      onSettingsClick={onSettingsClick} // Pass to footer component
    />
  );
});
