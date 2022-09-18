import time

from django.core.mail.backends.smtp import EmailBackend
from smtplib import SMTPResponseException, SMTPException


class ThrottlingAwareSmtpEmailBackend(EmailBackend):
    def _send(self, email_message):
        current_try = 0
        max_retries = 5
        while current_try < max_retries:
            try:
                return super()._send(email_message)
            except SMTPResponseException as e:
                if e.smtp_code == 454 and b'Throttling failure' in e.smtp_error:
                    # Throttling error
                    pass
                else:
                    raise
            min_sleep_interval, max_sleep_interval = 1, 10
            sleep_interval = min(min_sleep_interval * pow(2, current_try), max_sleep_interval)
            time.sleep(sleep_interval)
            current_try += 1
        raise SMTPException(f'Failed to send email after {max_retries} retries')
