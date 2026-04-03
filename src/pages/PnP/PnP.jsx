import styles from './PnP.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <h1>Our Approach to Privacy</h1>

        <p className={styles.intro}>
          This Privacy Policy explains how Lhok Inc. collects, uses, and shares your
          personal information when you use our website. By using our website, you agree
          to the terms of this Privacy Policy.
        </p>

        <div className={styles.section}>
          <h2>1. Information We Collect</h2>
          <p>
            We may collect personal information from you when you visit our website,
            fill out a form, or contact us by email. The types of personal information
            we may collect include your name, email address, phone number, and any other
            information you choose to provide. We may also collect non-personal information
            such as your IP address, browser type, and operating system. This information
            is used to analyze how our website is being used and to improve our services.
          </p>
        </div>

        <div className={styles.section}>
          <h2>2. How We Use Your Information</h2>
          <p>
            We use your personal information to respond to your inquiries, provide you
            with information about our services, and improve our website. We may also use
            your personal information to send you marketing materials about our services.
            We may share your personal information with third-party service providers who
            help us operate our website or provide services to you. We may also share your
            personal information with law enforcement or other government agencies when
            required by law.
          </p>
        </div>

        <div className={styles.section}>
          <h2>3. Cookies</h2>
          <p>
            Our website uses cookies, which are small files that are stored on your device
            when you visit our website. We use cookies to remember your preferences and to
            improve your experience on our website. You can choose to disable cookies in
            your browser settings, but this may affect your ability to use our website.
          </p>
        </div>

        <div className={styles.section}>
          <h2>4. Security</h2>
          <p>
            We take reasonable measures to protect your personal information from unauthorized
            access or disclosure. However, no method of transmission over the Internet or
            electronic storage is 100% secure.
          </p>
        </div>

        <div className={styles.section}>
          <h2>5. Links to Other Websites</h2>
          <p>
            Our website may contain links to other websites. We are not responsible for
            the privacy practices or content of these websites.
          </p>
        </div>

        <div className={styles.section}>
          <h2>6. Your Rights</h2>
          <p>
            You have the right to access, update, and delete your personal information.
            To do so, please contact us using the information provided below.
          </p>
        </div>

        <div className={styles.section}>
          <h2>7. Changes to this Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The most current version
            will be posted on our website.
          </p>
        </div>

      </div>
    </div>
  );
}