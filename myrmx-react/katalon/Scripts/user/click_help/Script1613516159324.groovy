import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testobject.ObjectRepository.findWindowsObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

not_run: WebUI.openBrowser('')

not_run: WebUI.navigateToUrl('https://react-app-stage.myroadmap.io/')

not_run: WebUI.click(findTestObject('Object Repository/Help_and_Support/Page_MyRoadmap/button_Log in'))

not_run: WebUI.setText(findTestObject('Object Repository/Help_and_Support/Page_MyRoadmap/input_Log in_formEmail'), 'halebeau3@gmail.com')

not_run: WebUI.setEncryptedText(findTestObject('Object Repository/Help_and_Support/Page_MyRoadmap/input_Log in_formPassword'), '8SQVv/p9jVRYfSV/eMGvjg==')

not_run: WebUI.click(findTestObject('Object Repository/Help_and_Support/Page_MyRoadmap/button_Log in_1'))

not_run: WebUI.click(findTestObject('Object Repository/Help_and_Support/Page_MyRoadmap/svg_Add Additional Roadmaps_svg-inline--fa _e183a5'))

WebUI.switchToWindowTitle('MyRoadmap')

WebUI.click(findTestObject('Object Repository/Help_and_Support/Page_MyRoadmap/div_Help  Support'))

WebUI.switchToWindowUrl('https://www.myroadmap.io/#/support')

WebUI.verifyElementText(findTestObject('Object Repository/Help_and_Support/Page_MyRoadmap - Human Engagement Platform/h1_MyRoadmap Support'), 
    'MYROADMAP SUPPORT')

WebUI.switchToWindowUrl('https://react-app-stage.myroadmap.io/common/bottom-menu')

