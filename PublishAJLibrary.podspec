#
# Be sure to run `pod lib lint PublishAJLibrary.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'PublishAJLibrary'
  s.version          = "5.0.0"
  s.summary          = 'A description of PublishAJLibrary. This is a temporary description'

# This description is used to generate tags and improve search results.
#   * Think: What does it do? Why did you write it? What is the focus?
#   * Try to keep it short, snappy and to the point.
#   * Write the description between the DESC delimiters below.
#   * Finally, don't worry about the indent, CocoaPods strips it!

  s.description      = <<-DESC
This is a pod only for a test purpose. It doesn't contain any valid code.
                       DESC

  s.homepage         = 'https://github.com/arjankowski/github-actions-release-test'
  # s.screenshots     = 'www.example.com/screenshots_1', 'www.example.com/screenshots_2'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'Artur Jankowski' => 'artur.jankowski@neontri.com' }
  s.source           = { :git => 'https://github.com/arjankowski/github-actions-release-test.git', :tag => "v"+s.version.to_s }
  # s.social_media_url = 'https://twitter.com/<TWITTER_USERNAME>'

  s.ios.deployment_target = '11.0'
  s.swift_versions = ["5.1", "5.2", "5.3"]

  s.source_files = 'PublishAJLibrary/Classes/**/*'
  
  # s.resource_bundles = {
  #   'PublishAJLibrary' => ['PublishAJLibrary/Assets/*.png']
  # }

  # s.public_header_files = 'Pod/Classes/**/*.h'
  # s.frameworks = 'UIKit', 'MapKit'
  # s.dependency 'AFNetworking', '~> 2.3'
end
