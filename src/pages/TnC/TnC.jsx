import styles from './TnC.module.css';

export default function TermsAndConditions() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        <h1>Terms & Conditions</h1>

        <p className={styles.intro}>
          Welcome to Lhok Inc. By using our website, you agree to these Terms of Use.
          Please read them carefully before using our website. If you do not agree
          to these Terms, you may not use our website.
        </p>

        <div className={styles.section}>
          <h2>1. Use of Website</h2>
          <p>
            You may use our website for lawful purposes only. You may not use our website
            to post or transmit any material that is unlawful, threatening, abusive,
            defamatory, or obscene; infringe on the intellectual property rights of others;
            or violate any applicable laws or regulations.
          </p>
        </div>

        <div className={styles.section}>
          <h2>2. Intellectual Property</h2>
          <p>
            All content on our website, including text, graphics, logos, and images,
            is the property of Lhok Inc. or its licensors and is protected by Canadian
            and international copyright laws. You may not reproduce, distribute, or
            transmit any content from our website without our prior written consent.
          </p>
        </div>

        <div className={styles.section}>
          <h2>3. Disclaimer of Warranties</h2>
          <p>
            We make no warranties or representations about the accuracy or completeness
            of the content on our website. We are not responsible for any errors or omissions
            in the content.
          </p>
        </div>

        <div className={styles.section}>
          <h2>4. Limitation of Liability</h2>
          <p>
            We are not liable for any damages arising from your use of our website or the
            content on our website. This includes direct, indirect, incidental, punitive,
            or consequential damages.
          </p>
        </div>

        <div className={styles.section}>
          <h2>5. Indemnification</h2>
          <p>
            You agree to indemnify and hold Lhok Inc. and its owner, employees, agents,
            and affiliates harmless from any claims, damages, expenses, or losses arising
            from your use of our website or your violation of these Terms.
          </p>
        </div>

        <div className={styles.section}>
          <h2>6. Links to Other Websites</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible
            for the content or privacy practices of these websites.
          </p>
        </div>

        <div className={styles.section}>
          <h2>7. Governing Law</h2>
          <p>
            These Terms are governed by the laws of Ontario and the federal laws of Canada
            applicable in Ontario.
          </p>
        </div>

        <div className={styles.section}>
          <h2>8. Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. The most current version will be
            posted on our website.
          </p>
        </div>

        <div className={styles.section}>
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about these Terms or our website, please contact us
            using the information provided on our website.
          </p>
        </div>

      </div>
    </div>
  );
}