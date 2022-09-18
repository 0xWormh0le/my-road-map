from django.test import TestCase

from splinter import Browser
browser = Browser('chrome', incognito=True)

BASE_URL = 'http://localhost:8000/'

browser.visit(BASE_URL)

def login(username, password):
    navigate('logout')
    browser.fill('username', username)
    browser.fill('password', password)
    browser.find_by_name('submitbutton').first.click()

def navigate(path):
    browser.visit(BASE_URL + 'dashboard/' + path)

def click_all_tabs():
    tabs = browser.find_by_css('.tab')
    for tab in tabs:
        tab.click()
        assert browser.is_element_present_by_css('.competencies-header', wait_time=5)

def create_delete_comment():
    browser.fill('comment', 'a selenium auto comment\n')
    assert browser.is_element_present_by_text('a selenium auto comment', wait_time=5)
    assert browser.is_element_present_by_text('Delete', wait_time=5)
    browser.find_by_text('Delete').first.click()
    assert browser.is_element_present_by_css('.swal2-confirm', wait_time=5)
    browser.find_by_css('.swal2-confirm').first.click()

def view_objective_detail():
    assert browser.is_element_present_by_css('.card-row', wait_time=5)
    browser.find_by_css('.card-row').first.click()
    assert browser.is_element_present_by_css('.top-head', wait_time=5)


class CoachTestCase(TestCase):
    def test_coach_flow(self):
        login('coach@revroad.com', '123')
        browser.find_by_css('.roadmap-box')[1].click()
        click_all_tabs()
        view_objective_detail()
        create_delete_comment()
        navigate('logout')


class AdminTestCase(TestCase):
     def test_admin_flow(self):
        login('admin@revroad.com', '123')
        browser.find_link_by_partial_href('staff/cohorts').click()
        browser.back()
        browser.find_link_by_partial_href('staff/users').click()
        browser.back()
        browser.find_link_by_partial_href('staff/roadmaps').click()
        browser.back()
        navigate('logout')


class UserTestCase(TestCase):
    def test_student_flow(self):
        login('user@revroad.com', '123')
        click_all_tabs()
        view_objective_detail()
        create_delete_comment()
        navigate('logout')


#test are run alphabetically, we want this to run very last
class ZZZTestCase(TestCase):
    def test_finish(self):
        browser.quit()