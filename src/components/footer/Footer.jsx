import React from "react";
import {
  FooterWrapper,
  FooterContent,
  FooterSection,
  FooterLink,
  FooterTitle,
} from "../../style";
import logo from "../../../public/logo.png";

function Footer() {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Survey App</FooterTitle>
          <p>Create and share surveys easily with our platform.</p>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/surveys">My Surveys</FooterLink>
          <FooterLink to="/responses">Responses</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Connect</FooterTitle>
          <FooterLink
            href="https://github.com/Esmanurrr"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </FooterLink>
          <FooterLink
            href="https://www.linkedin.com/in/esmanur-mazlum/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </FooterLink>
        </FooterSection>

        <FooterSection>
          <img
            style={{ width: "100px", height: "100px" }}
            src={logo}
            alt="Survey App Logo"
          />
        </FooterSection>
      </FooterContent>

      <FooterSection
        style={{ textAlign: "center", width: "100%", marginTop: "2rem" }}
      >
        <p>© 2024 Survey App. All rights reserved.</p>
      </FooterSection>
    </FooterWrapper>
  );
}

export default Footer;
