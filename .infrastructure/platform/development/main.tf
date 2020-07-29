module "devstub" {
  source  = "git@github.com:creditkudos/infrastructure.git//_lib/service/dev_stub/v1"
  context = module.context
}
